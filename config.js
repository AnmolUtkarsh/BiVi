const version = [
    "BiVi v1.1.2 Stable [AIO]",
    "BiVi v1.2.5 Stable [AIO]",
    "BiVi v1.3.0 Stable [AIO]",
    "BiVi v1.3.3 Stable [AIO]",
    "BiVi v1.5.0 Stable [AIO]",
    "BiVi_v1.5.1_Stable [AIO]",
    "BiVi_v1.5.2_Stable [AIO]",
    "BiVi v2.0.0 Stable [LTS]"
]
const edition = {
    "BiVi v1.1.2 Stable [AIO]" : "AIO", //Discord
    "BiVi v1.2.5 Stable [AIO]" : "AIO", //WhatsApp
    "BiVi v1.3.0 Stable [AIO]" : "AIO", //Story Mode Introduced
    "BiVi v1.3.3 Stable [AIO]" : "AIO", //Story Mode Introduced
    "BiVi v1.5.0 Stable [AIO]" : "AIO", //Bug Fixed
    "BiVi_v1.5.1_Stable [AIO]" : "AIO", //Google Chats
    "BiVi_v1.5.2_Stable [AIO]" : "AIO",
    "BiVi v2.0.0 Stable [LTS]" : "LTS"
}
const fix = {
    "BiVi v1.1.2 Stable [AIO]" : "* ChatBot released on Discord and Webhooks removed. Side by Side testing for Custom Memory Management Architecture \n* Many Commands Added and many in queue for Under Construction with same Tag.", 
    
    "BiVi v1.2.5 Stable [AIO]" : "* BiVi AIO Edition in queue for WhatsApp Updation and Webhook Configuration\n* Server Configuration Testing Startup Procedure", //WhatsApp
    
    "BiVi v1.3.0 Stable [AIO]" : "* Story Mode with 1 Testing Story and History Mode under Testing and Might released before Next 5 Software Updates.",
    

    "BiVi v1.3.3 Stable [AIO]": "* Story Mode Introduced in BiVi with 2 Stories, 1 for testing and 1 random." ,

    "BiVi_v1.5.0_Stable [AIO]": "* Lots of Bugs Like WhatsApp Webhook Error and Spam Fixed along with code Optimisations and Efficiency.",

    
    "BiVi_v1.5.1_Stable [AIO]":
    "\n* BiVi Finally Released on Google Chats! *\n" +
    "* `OwnerInfo`, `DevInfo` Commands Installed and few other commands like `Help` and `Hello` fixed.\n" +
    "* Big Improvement in `UserInfo`.\n" +
    "* Code reduced for efficiency.\n",


    "BiVi_v1.5.2_Stable [AIO]": "Lots of Bugs Fixed and one WhatsApp Webhook Error Fixed.\n* BiVi in Queue for testing History Mode and one Confidential Testings",


    "BiVi v2.0.0 Stable [LTS]": "BiVi in Queue for testing History Mode and one Confidential Testings.\n* Biggest Update till now in BiVi Series.\n* First LTS Edition.\n* Website of bivi.online is ready to deploy.\n* New CLI Introduced like `History`, `Modes`, `Language`, etc.\n* Biggest Update for whole BiVi Series.\n* Code Optimised to Depth.\n* Updating BiVi for Instagram Build",
}

const new_info = `Introducing all new ${version} Hyper Edition Equiped with advance Command Handling System. For more info please enter: "verinfo"`
module.exports = { version, fix, new_info , edition}