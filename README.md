# CS 6440 Practicum Project

<img 
    style="display: block; 
           margin: auto;
           width: 80%;"
    src="./Documentation/screenshot_1.png" 
    alt="Architectural Diagram">
</img>

## Overview

CNotes is a web application that allows users to view a simpler summarized version of their clinical notes data.


## Starting a Local Development Instance

1. Install dependencies.

```bash
npm install
# or
npm ci
``` 
2. In the root of the repo, create a file called `.env`. A sample file can be found below. Make sure to replace `API_KEY` with your own OpenAI API key.

```bash
API_KEY=<OPENAI_API_KEY>
MODEL_VER=gpt-3.5-turbo
ENV=LOCAL

# the variables below are not currently being used, 
# but they must still be present in the file, even if empty
FHIR_U=
FHIR_P=
FHIR_SERVER_URL=
```

3. Start a local development server.

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

3. Access the running application by visiting `http://localhost:5173/`.

## Building a Production Version
**Note:** the following steps are not necessary to run a local instance.

1. In the root of the repo, create a file called `.env.prod`. A sample file can be found below.

```bash
API_KEY=<OPENAI_API_KEY>
MODEL_VER=gpt-3.5-turbo
ENV=PROD

# the values below are not currently being used
FHIR_U=<FHIR_SERVER_USER_CREDS>
FHIR_P=<FHIR_SERVER_USER_CREDS>
FHIR_SERVER_URL="https://sample-url.com/fhir/"
```

2. Create a containerized production version of the app. The production build can be previews with `npm run preview`.

```bash
docker-compose build
```

The command above will result in a Docker image called `cnotes`.

## Technical Description

This web application was originally meant to query an external FHIR server in order to retrieve the clinical notes for a patient for a given date range, but instead it now loads the data from a local JSON file, `bundle.json`.

The pertinent is then extracted from the loaded file, and the clinical notes will be parsed from the DocumentReference 
resources found within the Bundle.

The resulting dataset is then be sent to an external language model for it to be summarized. This process may have to be repeated several times depending on the length of the input data. This is achieved through use of Open AI's ChatGPT API.



<img 
    style="display: block; 
           margin: auto;
           width: 80%; margin-bottom: 0"
    src="./Documentation/new_diagram.png" 
    alt="Architectural Diagram">
</img>
<p  style="margin: auto; margin-top: 0; text-align: center;">
    Figure 1: updated architectural diagram.
</p>


## Glossary

<div style="width: 60%">

- **Clinical Note:** the result of a health provider recording their interactions with a patient. Clinical notes can be "a record of visit, capturing the clinician’s subjective and objective findings, observations, diagnoses and recommended treatment plans" [1].   

  Within FHIR specifically, clinical notes can be one of at least eight different times of common clinical notes, which include consultation, discharge summary, history & physical, procedure, progress, imaging narrative, laboratory report narrative, and pathology report narrative notes [2].

- **FHIR:** The Fast Healthcare Interoperability Resources (FHIR, pronounced "fire") standard is a set of rules and specifications for exchanging electronic health care data [3].

- **DocumentReference:** In FHIR, a reference to a document of any kind for any purpose [4].
</div>

## References
<div style="width: 60%">

1. Understanding clinical notes: https://medium.com/@dothealth/understanding-clinical-notes-d98afeabf90

2. Clinical Notes Guidance: https://hl7.org/fhir/us/core/stu4/clinical-notes-guidance.html

3. Fast Healthcare Interoperability Resources - https://en.wikipedia.org/wiki/Fast_Healthcare_Interoperability_Resources

4. Resource DocumentReference - https://www.hl7.org/fhir/documentreference.html

</div>