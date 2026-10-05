const { version, fix, new_info, edition } = require('./config.js')
// const { getInstagramProfile, instagramBiViProfileFetch } = require("./cont.js");

function hello(name){
    return "Hi" + name + ", I am BiVi v2.1! Seems like you are new to me.\nLemme personalize the chatbot as per your Mood.\nI would request you to please complete one time Account setup for having our next level chatting go beyond the scenes.\n*This setup will be once per user. So please continue carefully!*\nBefore proceeding please keep in mind that whatever data you enter will be encrypted in the database before going to the server.\nHere's the type of encryption:\n> Encryption Type: `Encode640 ASCI Custom`\n> Encryption Status: `Aggressive`\n> Server: `Official Render Build`\n> Database: `MongoDB [Official]`\n> Version: `1.37.24` [Official Build with Encryption]\n//We included Latest Version of the BiVi [ChatBot] such that Encryption can be verified further.\nI would like to ask you whether you will like to proceed? : [`Yes`/`No`]\n//Keep in mind that Entering 'NO' will restrict in the lifetime to the ChatBot to ever receive message from your specific number until specified so."
}

function no(){
    return "No Problem, that's completely fine that you don't want continue. But can I ask why you don't wanna continue?\n\n```Choose the Number as per your choice: Why don't you want to continue?```\n\n> 1. Data Privacy Concern.\n> 2. Don't want to talk.\n> 3. Will not be able to chat.\n> 4. Don't trust the ChatBot.\n> 5. Don't even want to share.\n> 6. Sorry, I would like to CONTINUE instead to the ChatBot BiVi.\n\nBtw wait!, Then why the hell did you message me you didn't wanted to chat to me?\nYou feel suspicious! 👁️👄👁️"
}

function yes(){
    return "Perfect, now may I know your good name so that I can actually call you from that name. Please keep in mind that you can change your name later.\nEnter your Name [Only Name]:"
}

function lang(){

}

module.exports = {hello}