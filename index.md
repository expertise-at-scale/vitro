Quick Links:  |  [:page_with_curl:   Read our paper](#read-the-vitro-pdf)  |  [:link:  Cite our work](#cite-our-work)  |  [:computer:  Setup](#installing-vitro)

## Thanks for your interest in Vitro

We're thrilled to share that our first research paper on Vitro and the design process behind it has been published at DIS 2019! To encourage others interested in contributing to or building off of our work, we've open sourced the code for the project.

At a high level, Vitro consists of two highly interdependent code bases, which are both required in order to get the assistant up-and-running on your machine.
1. [**The Vitro front-end**](https://github.com/expertise-at-scale/vitro): An Electron-based app that handles microphone input, sends requests to the Google Assistant, and manages audio-based responses; it also contains a visual interface (built with Vue.js) to display current step information and other system state (e.g. listening status)
2. [**The Vitro dialogue manager**](https://github.com/expertise-at-scale/vitro_dialogue): A custom application built with the Actions on Google SDK. This provides the custom logic for handling different "intents" from the user, like asking for the next step in a protocol, repeating steps, skipping, etc.

## Installing Vitro
Getting Vitro up and running requires downloading, configuring, and running a complicated suite of services. The following instructions try to document this process as best as possible, but may not be complete or robust to the environment running on your machine. If you get stuck, please file an issue through GitHub or email Julia (see paper for contact information).

### Vitro front-end
First, start by setting up the [Vitro front-end](https://github.com/expertise-at-scale/vitro)
1. Fork repo
2. Install Yarn
3. Run `yarn` to install dependencies
4. Get client credentials from Google (note that you may need to use a personal Gmail account in order to set up an Actions on Google project)
    ** must configure OAuth consent page first
    ** must use OAuth OTHER credentials

### Dialogflow
Next, set up the intent parsing logic for Vitro on [Dialogflow](https://dialogflow.com/), which handles natural language processing for Google Assistant skills:
1. Download the Vitro agent: vitro_dialogflow.zip
2. Create an agent on Dialogflow
3. Click the gear icon on the top left next to your project's name
4. Click the "Export and Import" tab
5. Use the "Restore" function to import the contents of vitro_dialogflow.zip

### Firebase
Now, set up Firebase (used for storing step content)
1. Go to https://console.firebase.google.com from the same Google account used for the other services
2. Select the same project name you've been using (Vitro)
3. Under the Develop section of the menu on the left, choose Functions
4. Click Get Started
5. Run `npm install -g firebase-tools`
6. Run `firebase init`
7. Make sure you're logged into firebase properly
8. Initialize firestore and load step content in
9. [Download and install ngrok](https://ngrok.com/) (might want to move it into the vitro_dialogue folder --  folder above functions)
10. Start ngrok by running `ngrok http 5000`
11. Back on Dialogflow, go to Fulfillment in the lefthand sidebar. Set the webhook to https://<ngrok url>/open-vitro/us-central1/cellbot

### Tie things together for testing
Making sure the Vitro Electron front-end knows who to talk to:
1) On Dialogflow, within Integrations, click on "Integration Settings" option in the Google Assistant box
2) Click MANAGE ASSISTANT APP
3) Set up an invocation display name within the actions setting
4) Under Deploy, click the "Release" option
5) Use the Alpha tester setting, and copy the opt-in link
6) Share the link with whichever account you plan to test the Electron app with


## Read the Vitro PDF
To learn more about how Vitro works, the design process behind its feature set, and our preliminary user evaluation, [read the DIS 2019 paper on our research with Vitro](juliacambre.com/Vitro%20(DIS%202019).pdf).

## Cite our work
If you use Vitro for your own research, please cite us:

```
@inproceedings{Cambre:2019:VDV:3322276.3322298,
 author = {Cambre, Julia and Liu, Ying and Taylor, Rebecca E. and Kulkarni, Chinmay},
 title = {Vitro: Designing a Voice Assistant for the Scientific Lab Workplace},
 booktitle = {Proceedings of the 2019 on Designing Interactive Systems Conference},
 series = {DIS '19},
 year = {2019},
 isbn = {978-1-4503-5850-7},
 location = {San Diego, CA, USA},
 pages = {1531--1542},
 numpages = {12},
 url = {http://doi.acm.org/10.1145/3322276.3322298},
 doi = {10.1145/3322276.3322298},
 acmid = {3322298},
 publisher = {ACM},
 address = {New York, NY, USA},
 keywords = {augmented scientific workplace, conversational agent, design research, voice assistant},
}
```
