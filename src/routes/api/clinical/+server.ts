import { json } from '@sveltejs/kit';
import { FHIR_SERVER_URL } from '$env/static/private';
import * as fs from 'fs';

export async function GET({ url } : any) {
  let results = "";
  try {
    results = await getClinicalData(url.searchParams);    
  } catch (error) {
    console.debug("error", results);
    return json({result: `Error: ${error}`}, { status: 500 });
  }
  if (results) {
	  return json({result: results}, { status: 200 });
  }
  // status should be 204, but there is a bug 
  // that makes it fail when that status is used
  return json({result: "nothing"}, { status: 200 });
}

function parseClinicalData(data: any): string {
  let encoded = null;
  let decoded = 'null';
  
  if (data) {
    encoded = data?.resource?.content?.pop(0)?.attachment?.data;    
    if (encoded) {
      decoded = atob(encoded);
    } else {
      console.error("failed to parse clinical data.");
      decoded = "";
    }
  } else {
    console.error("No data to parse.")
  }
  return decoded;
}

// fetches clinical data from remote server
async function fetchClinicalData(params: any) {
  let rawNotes = "";
  const startDate = params.get("startDate");
  const endDate = params.get("endDate");
  let patient = params.get("patientId");
  const headers = new Headers();

  const fetchUrl = `${FHIR_SERVER_URL}/DocumentReference?date=ge${startDate}&date=le${endDate}&patient=${patient}&type=clinical-notes&_pretty=true`;
  console.debug('GET:', fetchUrl);
  let response = null;
  let bundle =  null;
  try {
    response = await fetch(fetchUrl, {headers: headers});
    if (response) {
      bundle = await response.json();
    }
  } catch(error) {
    console.error("An error occurred while fetching clinical data: ", error);
    throw error;
  }
  const data = parseResultsFromBundle(bundle)
  data.forEach((element: any) => {
    rawNotes += parseClinicalData(element) + "\n\n";
  });

  return rawNotes;
}

function parseResultsFromBundle(data: any) {
  let results: any[] = [];
  
  if (data && data.resourceType === "Bundle" && data.total >= 1) {
    if (data.entry && Array.isArray(data.entry)) {
      data.entry.forEach((element: any) => {
        results.push(element);
      });
    } 
  }

  return results;
}

async function getClinicalData(params: any) {
  if (FHIR_SERVER_URL) {
    console.debug("fetching data from remote server");
    return await fetchClinicalData(params);
  }
  console.debug("loading data from file");
  return await loadClinicalDataFromFile();
}

function loadClinicalDataFromFile() {
  let clinicalData = "";
  const results = parseResultsFromBundle(readJsonFile());
  if (results) {
    results.forEach((item: any) => {
      clinicalData += parseClinicalData(item) + "\n\n";
    });
  }
  return clinicalData;
}

function readJsonFile(path: string = './bundle.json') {
  const data = fs.readFileSync(path, 'utf8');
  const result = JSON.parse(data);
  return result;
}

// const testDoc = {
// "resource": {
//   "resourceType": "DocumentReference",
//   "id": "1",
//   "meta": {
//     "profile": [ "http://hl7.org/fhir/us/core/StructureDefinition/us-core-documentreference" ]
//   },
//   "identifier": [ {
//     "system": "urn:ietf:rfc:3986",
//     "value": "urn:uuid:acae90d9-8ae9-040f-7f8a-7275eb93947f"
//   } ],
//   "status": "superseded",
//   "type": {
//     "coding": [ {
//       "system": "http://loinc.org",
//       "code": "34117-2",
//       "display": "History and physical note"
//     }, {
//       "system": "http://loinc.org",
//       "code": "51847-2",
//       "display": "Evaluation + Plan note"
//     } ]
//   },
//   "category": [ {
//     "coding": [ {
//       "system": "http://hl7.org/fhir/us/core/CodeSystem/us-core-documentreference-category",
//       "code": "clinical-note",
//       "display": "Clinical Note"
//     } ]
//   } ],
//   "subject": {
//     "reference": "urn:uuid:69d91f33-8e8a-ae81-2153-c1de98afd797"
//   },
//   "date": "2004-03-17T05:04:35.290-08:00",
//   "author": [ {
//     "reference": "Practitioner?identifier=http://hl7.org/fhir/sid/us-npi|9999886291",
//     "display": "Dr. Luna60 Littel644"
//   } ],
//   "custodian": {
//     "reference": "Organization?identifier=https://github.com/synthetichealth/synthea|7f32dd7d-5c35-3ddb-839b-8fbbb930d412",
//     "display": "ST PATRICK'S MANOR"
//   },
//   "content": [ {
//     "attachment": {
//       "contentType": "text/plain; charset=utf-8",
//       "data": "QWRtaXNzaW9uIERhdGU6IFszMDIwLTQtMTBdIERpc2NoYXJnZSBEYXRlOiBbMzAyMC00LTI1XQpEYXRlIG9mIEJpcnRoOiBbMjk2NS0xMi0xNV0gU2V4OiBGClNlcnZpY2U6IEVuZG9jcmlub2xvZ3kKCkNoaWVmIENvbXBsYWludDogRnJlcXVlbnQgdXJpbmF0aW9uLCBpbmNyZWFzZWQgdGhpcnN0LCBhbmQgdW5leHBsYWluZWQgd2VpZ2h0IGxvc3MKTWFqb3IgU3VyZ2ljYWwgb3IgSW52YXNpdmUgUHJvY2VkdXJlOiBOb25lCkhpc3Rvcnkgb2YgUHJlc2VudCBJbGxuZXNzOiA1NC15ZWFyLW9sZCBmZW1hbGUgYWRtaXR0ZWQgd2l0aCBjb21wbGFpbnRzIG9mIGZyZXF1ZW50IHVyaW5hdGlvbiwgaW5jcmVhc2VkIHRoaXJzdCwgYW5kIHVuZXhwbGFpbmVkIHdlaWdodCBsb3NzIG92ZXIgdGhlIHBhc3QgbW9udGguIFBhdGllbnQgaGFzIGEgaGlzdG9yeSBvZiB0aHlyb2lkIGlzc3VlcyBidXQgbm8gcHJldmlvdXMgZGlhZ25vc2VzIG9mIGRpYWJldGVzLgpBbGxlcmdpZXM6IFN1bGZhIERydWdzCgpQYXN0IE1lZGljYWwgSGlzdG9yeTogSHlwb3RoeXJvaWRpc20sIE1pZ3JhaW5lcwpTb2NpYWwgSGlzdG9yeTogTm9uLXNtb2tlciwgb2NjYXNpb25hbCBkcmlua2VyLCB3b3JrcyBhcyBhbiBhY2NvdW50YW50LCBkaXZvcmNlZCB3aXRoIG9uZSBhZHVsdCBjaGlsZAoKRmFtaWx5IEhpc3Rvcnk6IE1vdGhlciB3aXRoIGhpc3Rvcnkgb2YgVHlwZSAyIERpYWJldGVzCgpQaHlzaWNhbCBFeGFtOgpHZW5lcmFsOiBBcHBlYXJzIHRpcmVkLCBidXQgbm90IGluIGFjdXRlIGRpc3RyZXNzClZpdGFsIFNpZ25zOiBCUCAxMzAvODUgbW1IZywgSFIgODAgYnBtLCBSUiAxOCBicmVhdGhzIHBlciBtaW51dGUsIFRlbXAgOTguN8KwRiwgU3BPMiA5OCUgb24gcm9vbSBhaXIKRW5kb2NyaW5lOiBObyBnb2l0ZXIgb3Igbm9kdWxlcyBwYWxwYWJsZQpSZXNwaXJhdG9yeTogQ2xlYXIgdG8gYXVzY3VsdGF0aW9uIGJpbGF0ZXJhbGx5CkFiZG9tZW46IFNvZnQsIG5vbi10ZW5kZXIsIG5vIG1hc3NlcyBwYWxwYWJsZQpFeHRyZW1pdGllczogTm8gZWRlbWEsIHB1bHNlcyBpbnRhY3QKClBlcnRpbmVudCBSZXN1bHRzOgoKQmxvb2QgR2x1Y29zZTogMjgwIG1nL2RMCkhiQTFjOiA5LjAlClRoeXJvaWQgRnVuY3Rpb24gVGVzdHM6IFdpdGhpbiBub3JtYWwgcmFuZ2UKVXJpbmUgQW5hbHlzaXM6IFBvc2l0aXZlIGZvciBnbHVjb3NlIGFuZCBrZXRvbmVzCgpCbG9vZCBDdWx0dXJlczogTm8gZ3Jvd3RoCgpNZWRpY2F0aW9ucyBvbiBBZG1pc3Npb246Ckxldm90aHlyb3hpbmUgMTAwIG1jZyBkYWlseQpJYnVwcm9mZW4gYXMgbmVlZGVkCkRpc2NoYXJnZSBNZWRpY2F0aW9uczoKTGV2b3RoeXJveGluZSAxMDAgbWNnIGRhaWx5Ck1ldGZvcm1pbiA1MDAgbWcgdHdpY2UgYSBkYXkKRGlzY2hhcmdlIERpYWdub3NpczogTmV3bHkgZGlhZ25vc2VkIFR5cGUgMiBEaWFiZXRlcywgSHlwb3RoeXJvaWRpc20sIE1pZ3JhaW5lcwpEaXNjaGFyZ2UgQ29uZGl0aW9uOiBJbXByb3ZlZAoKRGlzY2hhcmdlIEluc3RydWN0aW9uczoKCkZvbGxvdyB1cCB3aXRoIGVuZG9jcmlub2xvZ2lzdCBpbiAxIHdlZWsKU3RhcnQgTWV0Zm9ybWluIGFzIHByZXNjcmliZWQKTW9uaXRvciBibG9vZCBzdWdhciBsZXZlbHMgcmVndWxhcmx5CkZvbGxvdy11cCBJbnN0cnVjdGlvbnM6CkZvbGxvdyB1cCB3aXRoIGVuZG9jcmlub2xvZ2lzdCBpbiAxIHdlZWsgZm9yIGZ1cnRoZXIgZXZhbHVhdGlvbiBhbmQgdHJlYXRtZW50IHBsYW4="
//     },
//     "format": {
//       "system": "http://ihe.net/fhir/ihe.formatcode.fhir/CodeSystem/formatcode",
//       "code": "urn:ihe:iti:xds:2017:mimeTypeSufficient",
//       "display": "mimeType Sufficient"
//     }
//   } ],
//   "context": {
//     "encounter": [ {
//       "reference": "urn:uuid:172af4ff-43b8-261f-49e0-6582f8b8e583"
//     } ],
//     "period": {
//       "start": "2004-03-17T05:04:35-08:00",
//       "end": "2004-03-17T06:04:35-08:00"
//     }
//   }
// }}