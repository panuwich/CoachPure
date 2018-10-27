'use strict';
var admin = require('firebase-admin');
const { WebhookClient } = require('dialogflow-fulfillment');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request-promise');
process.env.DEBUG = 'actions-on-google';
const LINE_HEADER = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer 5zZDAVNSuD9E/qiirLZcVEjUQuq4SXJLpU/rlyhljyqie3aukavSPD73mbJCQ2XW7G543O7Ht7jstVf5TjR2nRoF2j3LcF3a2eQA0b7gU5/a1kXo5tLDgFBYRxxM4705mw0OuSx6EZR5M7g2PhxvLgdB04t89/1O/w1cDnyilFU='
};
const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';

const pushBMI = (ID, bmi) => {
    return request({
        method: 'POST',
        uri: LINE_MESSAGING_API + '/push',
        headers: LINE_HEADER,
        body: JSON.stringify({
            to: ID,
            messages: [
                {
                    type: "flex",
                    altText: "reply flex message",
                    contents: {
                        type: "bubble",
                        styles: {
                            header: {
                                backgroundColor: "#999966",
                            }
                        },
                        header: {
                            type: "box",
                            layout: "vertical",
                            contents: [
                                {
                                    type: "text",
                                    text: "BMI ของคุณคือ " + bmi.toFixed(2),
                                    align: "center"
                                }
                            ]
                        },
                        body: {
                            type: "box",
                            layout: "vertical",
                            spacing: "md",
                            contents: [

                                {
                                    type: "box",
                                    layout: "horizontal",
                                    spacing: "md",
                                    contents: [
                                        {
                                            type: "text",
                                            align: "center",
                                            text: "< 18.50"
                                        },
                                        {
                                            type: "separator"
                                        },
                                        {
                                            type: "text",
                                            align: "center",
                                            text: "ผอม"
                                        }
                                    ]
                                },
                                {
                                    type: "box",
                                    layout: "horizontal",
                                    spacing: "md",
                                    contents: [
                                        {
                                            type: "text",
                                            align: "center",
                                            text: "18.50 - 22.90"
                                        },
                                        {
                                            type: "separator"
                                        },
                                        {
                                            type: "text",
                                            align: "center",
                                            text: "ปกติ (สุขภาพดี)"
                                        }
                                    ]
                                },
                                {
                                    type: "box",
                                    layout: "horizontal",
                                    spacing: "md",
                                    contents: [
                                        {
                                            type: "text",
                                            align: "center",
                                            text: "23 - 24.90"
                                        },
                                        {
                                            type: "separator"
                                        },
                                        {
                                            type: "text",
                                            align: "center",
                                            text: "ท้วม"
                                        }
                                    ]
                                },
                                {
                                    type: "box",
                                    layout: "horizontal",
                                    spacing: "md",
                                    contents: [
                                        {
                                            type: "text",
                                            align: "center",
                                            text: "25 - 29.90"
                                        },
                                        {
                                            type: "separator"
                                        },
                                        {
                                            type: "text",
                                            align: "center",
                                            text: "อ้วน"
                                        }
                                    ]
                                },
                                {
                                    type: "box",
                                    layout: "horizontal",
                                    spacing: "md",
                                    contents: [
                                        {
                                            type: "text",
                                            align: "center",
                                            text: "> 30"
                                        },
                                        {
                                            type: "separator"
                                        },
                                        {
                                            type: "text",
                                            align: "center",
                                            text: "อ้วนเกินไปแล้วนะ"
                                        }
                                    ]
                                },
                            ]
                        }

                    }
                }
            ]
        })
    }).then(() => {
        return res.status(200);//res.status(200).send(Done);
    }).catch((error) => {
        return;
    });
}

const pushCal = (ID, menu, cal) => {
    return request({
        method: 'POST',
        uri: LINE_MESSAGING_API + '/push',
        headers: LINE_HEADER,
        body: JSON.stringify({
            to: ID,
            messages: [
                {
                    type: "text",
                    text: menu + "มี " + cal + " แคลอรี่"
                }
            ]
        })
    }).then(() => {
        return res.status(200);//res.status(200).send(Done);
    }).catch((error) => {
        return;
    });
}

const pushError = (ID, msg) => {
    return request({
        method: 'POST',
        uri: LINE_MESSAGING_API + '/push',
        headers: LINE_HEADER,
        body: JSON.stringify({
            to: ID,
            messages: [
                {
                    type: "text",
                    text: msg
                }
            ]
        })
    }).then(() => {
        return res.status(200);//res.status(200).send(Done);
    }).catch((error) => {
        return;
    });
}

const server = express();
server.use(bodyParser.urlencoded({
    extended: true
}));

server.use(bodyParser.json());

var serviceAccount = require("./botdbkey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://testbot-acd22.firebaseio.com'
});

var db = admin.database();
var ref = db.ref("/");


function test(msg) {
    console.log("Hello Realtime database");

	/*
  	//SELECT * profile WHERE id = U6733b19e487ac9a823d742eafdf3a365
	var itemRef = ref.child("profile");
	itemRef.child("Ud3375351be60efc187b3f137a32b66aa").on("value", function(snapshot) {
	  let id= snapshot.val();
	  console.log(id);
    });
  
    //SELECT * FROM profile WHERE name = "อาจารย์พู่";
    var itemRef = ref.child("profile");
    itemRef.orderByChild("name").equalTo("อาจารย์พู่").on("value", function(snapshot) {
  	  let profile = snapshot.val();
  	  console.log(profile);
  	  //console.log(event['-LMwnQSUOXiKj1WYQp8z'].type);
        //snapshot.forEach(function(data) {
        //    console.log(event[data.key].type);
        //});
    });
	
	//SELECT * FROM profile LIMIT 10
    var itemRef = ref.child("profile");
    itemRef.orderByKey().limitToFirst(10).on("value", function(snapshot) {
  	  let profile = snapshot.val();
  	  console.log(profile);
  	 
    });
	*/
    //SELECT * FROM profile WHERE type = "admin" && profileCreatedTime = "9/19/2018, 3:09:48 PM";



    //create new table

    var itemRef = ref.child("test");
    var newItemRef = itemRef.push();
    newItemRef.set({
        "User ID": msg,
        "Message": 'Hello Firebase Database',
        "Message Created Time": new Date().toString()
    });

    var itemId = newItemRef.key;
    console.log("A new item with ID " + itemId + " is created.");
	/*
  
    */
}


server.post('/', function (request, response) {
    const agent = new WebhookClient({ request, response });

    //const number = agent.parameters.number;

    function welcome(agent) {

        agent.add(`Welcome to my agent!`);
    }


    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }

    function calBMI(agent) {
        var height = 1;
        var weight = 1;
        const userId = agent.originalRequest.payload.data.source.userId;
        var itemRefu = ref.child("user");
        itemRefu.once("value").then(function (snapshot) {
            var hasUser = snapshot.hasChild(userId);
            if (hasUser == false) {
                pushError(userId, "กรุณาบันทึกข้อมูลผู้ใช้\nก่อนคำนวณ BMI ด้วยครับ");

            } else {
                var itemRef = ref.child("user").child(agent.originalRequest.payload.data.source.userId);
                itemRef.orderByChild("userId").equalTo(agent.originalRequest.payload.data.source.userId)
                    .on("child_added", function (snapshot) {
                        height = snapshot.val().userHeight;
                        weight = snapshot.val().userWeight;
                        height = height / 100;
                        console.log(height + " " + weight);
                        var bmi = weight / (height * height);
                        pushBMI(agent.originalRequest.payload.data.source.userId, bmi);
                    });
            }
        });



    }

    function aboutYou(agent) {
        const userId = agent.originalRequest.payload.data.source.userId;
        var date = new Date();
        var DOB = agent.parameters.DOB;
        var age = date.getFullYear() - DOB;
        const gender = agent.parameters.gender.toUpperCase();
        const height = agent.parameters.height;
        const weight = agent.parameters.weight;
        var ans = "";
        if (DOB == "" || gender == "" || height == "" || weight == "") {
            ans = "กรุณาบันทึกข้อมูลอีกครั้ง";
        } else if (age > 100 || age <= 0 || (gender != "M" && gender != "F")
            || height >= 250 || height < 50 || weight > 200 || weight <= 1) {
            ans = "กรุณากรอกข้อมูลให้ถูกต้องด้วยครับ";

        } else {
            var BMR = 0;
            if (gender == "M") {
                BMR = 66 + (13.7 * weight) + (5 * height) - (6.8 * age);
            } else {
                BMR = 665 + (9.6 * weight) + (1.8 * height) - (4.7 * age);
            }
            const TDEE = BMR * 1.2;
            ref.child("user").child(userId).remove();
            var itemRef = ref.child("user").child(userId);

            var newItemRef = itemRef.push();

            newItemRef.update({
                "userId": userId,
                "userDOB": DOB,
                "userGender": gender,
                "userHeight": height,
                "userWeight": weight,
                "userTDEE": TDEE,
                "userCal": 0
            });
            ans = "บันทึกข้อมูลเรียบร้อยครับผม";
        }
        agent.add(ans);

    }

    function remainCal(agent) {

        var itemRef = ref.child("user").child(agent.originalRequest.payload.data.source.userId);;
        itemRef.orderByChild("userId").equalTo(agent.originalRequest.payload.data.source.userId)
            .on("child_added", function (snapshot) {
                const calRemain = (snapshot.val().userTDEE - snapshot.val().userCal).toFixed(2);
                //console.log(calRemain);
                agent.add("วันนี้คุณรับประทานได้อีก " + calRemain + " แคลอรี่");

            });
    }
    function calFoodCalories(agent) {
        const userId = agent.originalRequest.payload.data.source.userId;
        const menu = agent.parameters.menu;
        const num = agent.parameters.num;
        var cal = 0;
        //console.log(checkUser());
        var itemRefu = ref.child("user");
        itemRefu.once("value").then(function (snapshot) {
            var hasUser = snapshot.hasChild(userId);       
            if(hasUser == true){
                var itemRef = ref.child("food");
                itemRef.once("value").then(function (snapshot) {
                    var hasMenu = snapshot.hasChild(menu);
                    if (hasMenu == false) {
                        pushError(userId, "ขออภัยยังไม่มี"+ menu +"ในฐานข้อมูลครับ");
                        pushError(userId, "หากไม่มีรายการเพิ่มเติม กรุณาพิมคำว่า \"เสร็จสิ้น\" ด้วยครับ");
                    } else {
                        pushError(userId, "บันทึกข้อมูลเรียบร้อยครับ");
                        pushError(userId, "หากไม่มีรายการเพิ่มเติม กรุณาพิมคำว่า \"เสร็จสิ้น\" ด้วยครับ");
                        itemRef.orderByChild("foodName").equalTo(menu)
                            .on("child_added", function (snapshot) {
                                cal = snapshot.val().calories;
                                cal *= num;
                                console.log(num);
                                console.log(cal);
        
                                var itemRef2 = ref.child("user").child(agent.originalRequest.payload.data.source.userId);;
                                itemRef2.orderByChild("userId").equalTo(agent.originalRequest.payload.data.source.userId)
                                    .on("child_added", function (snapshot) {
                                        cal = snapshot.val().userCal + cal;
                                        snapshot.ref.update({ userCal: cal })
        
                                    });
                            });
                    }
                });
                }else{
                    pushError(userId,"กรุณาบันทึกข้อมูลผู้ใช้ก่อนครับ");
                    pushError(userId,"กรุณาพิมคำว่า \"เสร็จสิ้น\" ก่อนกดบันทึกข้อมูลด้วยครับ");
                }
        });








    }
    function calExerciseCalories(agent) {
        const sport = agent.parameters.sport;
        const num = agent.parameters.num;
        var cal = 0;
        const userId = agent.originalRequest.payload.data.source.userId;
        var itemRefu = ref.child("user");
        itemRefu.once("value").then(function (snapshot) {
            var hasUser = snapshot.hasChild(userId);      
            if(hasUser==true){
                var itemRef = ref.child("sport");
                itemRef.once("value").then(function (snapshot) {
                    var hasSport = snapshot.hasChild(sport);
                    if (hasSport == false) {
                        pushError(userId, "ขออภัยยังไม่มี" + sport +"ในฐานข้อมูลครับ");
                        pushError(userId, "หากไม่มีรายการเพิ่มเติม กรุณาพิมคำว่า \"เสร็จสิ้น\" ด้วยครับ");
                    } else {
                        pushError(userId, "บันทึกข้อมูลเรียบร้อยครับ");
                        pushError(userId, "หากไม่มีรายการเพิ่มเติม กรุณาพิมคำว่า \"เสร็จสิ้น\" ด้วยครับ");
                        var itemRef = ref.child("sport");
                        itemRef.orderByChild("sportName").equalTo(sport)
                            .on("child_added", function (snapshot) {
                                cal = snapshot.val().calories;
                                cal *= num;
        
                                var itemRef2 = ref.child("user").child(agent.originalRequest.payload.data.source.userId);;
                                itemRef2.orderByChild("userId").equalTo(agent.originalRequest.payload.data.source.userId)
                                    .on("child_added", function (snapshot) {
                                        cal = snapshot.val().userCal - cal;
                                        snapshot.ref.update({ userCal: cal })
        
                                    });
                            });
                    }
        
                });
                }else{
                    pushError(userId,"กรุณาบันทึกข้อมูลผู้ใช้ก่อนครับ");
                    pushError(userId,"กรุณาพิมคำว่า \"เสร็จสิ้น\" ก่อนกดบันทึกข้อมูลด้วยครับ");
                }      
        });
        




    }

    function askCalories(agent) {
        const menu = agent.parameters.menu;
        const userId = agent.originalRequest.payload.data.source.userId;
        var itemRef = ref.child("food");
        itemRef.once("value").then(function (snapshot) {
            var hasUser = snapshot.hasChild(menu);
            if (hasUser == false) {
                pushError(userId, "ขออภัยยังไม่มีเมนูนี้ในฐานข้อมูล");

            } else {
                itemRef.orderByChild("foodName").equalTo(menu)
                    .on("child_added", function (snapshot) {
                        const m = snapshot.val().calories;
                        pushCal(agent.originalRequest.payload.data.source.userId, menu, m);

                    });
            }
        });



    }
    let intentMap = new Map();

    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('BMI', calBMI);
    intentMap.set('recordCal - eat - cal', calFoodCalories);
    intentMap.set('recordCal - exercise - cal', calExerciseCalories);
    intentMap.set('recordCal - eat - fin', remainCal);
    intentMap.set('recordCal - exercise - fin', remainCal);
    intentMap.set('askCalories - find', askCalories);
    intentMap.set('About You - fill info', aboutYou);
    agent.handleRequest(intentMap);
});

server.listen((process.env.PORT || 8000), () => {
    console.log("Server is up and running...");
});
