Meteor.methods({
  bookTimeSlot(requestedTimeSlot) {
    // finish the time slot reservation function
    // .. your code goes here
    throw new Meteor.Error('this is not defined yet')
  }
})



Meteor.publish('bookings', function(day) {
  return Bookings.find({day: day})
})



Meteor.startup(() => {
  if (Bookings.find().count() === 0) {
    Bookings.insert({day: '2018-10-29', from: 8, to: 10, hours: 2});
    Bookings.insert({day: '2018-10-29', from: 13, to: 14, hours: 1});
  }
});
