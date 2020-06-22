'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendNewNotification = functions.database.ref('/notifications/{pushId}')
    .onCreate(async (snap, context) => {
      const note = snap.val();
      console.log('data sent is : ', note);
      const noteId = context.params.pushedId;

      const messageContent = {
        notification: {
        title: note.title,
        body: note.body
      }      
    };

    const response = await admin.messaging().sendToTopic("notifications", messageContent);
    response.result.forEach((result, index) => {
      const error = result.error;
      if (error) {
        //console.error('Failure sending notification');
      }
    });
    return null;
  });

  exports.reservationAppointmentNotification = functions.database.ref('/appointments/{doctorId}/{appointmentId}/reservations/{pushId}')
    .onCreate(async (snap, context) => {
      const appointment = snap.val();
      console.log('new reservation : ', appointment);
      //const noteId = context.params.pushedId;

      const messageContent = {
        notification: {
        title: 'حجز جديد من '.concat(appointment.name),
        body: 'يوم '.concat(appointment.day)
      },
      token: appointment.tokenId
    };

    const response = await admin.messaging().send(messageContent);
    response.result.forEach((result, index) => {
      const error = result.error;
      if (error) {
        //console.error('Failure sending notification');
      }
    });
    return null;
  });