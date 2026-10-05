const { MongoClient } = require('mongodb')

const uri = "mongodb://localhost:4500";

const client = new MongoClient(uri);

client.connect()

// try{
//     (async ()=>{
//         const a = await client.db("test1").collection("User_Info").find().toArray();
//         console.log(a)
//     })()
// }catch(error){
//     console.log("Error in Finding the Data!")
// }



async function func1(mess) {



    const userId = mess?.author?.id ||
        mess?.body?.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.wa_id ||
        mess?.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from ||
        mess?.body?.chat?.user?.name ||
        mess?.body?.entry?.[0]?.messaging?.[0]?.sender?.id;

    const user_main_id = "BV" + userId;

    try {
        const a = await client.db("BiVi").collection('BiVi_User').find({
            bv_user_id: user_main_id
        }).toArray()

        if (a.length > 0) {
            return true;
        }
        else {
            return false;
        }
    } catch (error) {
        console.log("Unable to run database search operation!")
    }
}
async function check_user(mess) {
    console.log(await func1(mess));
}















async function func2(mess) {



    const userId = mess?.author?.id ||
        mess?.body?.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.wa_id ||
        mess?.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from ||
        mess?.body?.chat?.user?.name ||
        mess?.body?.entry?.[0]?.messaging?.[0]?.sender?.id;

    const user_main_id = "BV" + userId;

    try {
        const a = await client.db("BiVi").collection('BiVi_User').find({ bv_user_id: user_main_id }, {
            _id: 0,
            userName = 1,
            userMood = 1,
            userLang = 1,
        }).toArray()

        return {
            bivi_main_id: user_main_id,
            userName: a[0].userName,
            userMood: a[0].userMood,
            userMood: a[0].userLang,
        }
    } catch (error) {
        console.log("Unable to run database search operation!")
    }
}
async function find_user(mess) {
    console.log(await func2(mess));
}



module.exports = { check_user, find_user }