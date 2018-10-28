Template.availableTimes.onCreated(function() {
  this.timeSlots = new ReactiveVar();
  this.selectedDay = new ReactiveVar();
})



Template.availableTimes.onRendered(function() {
  this.autorun(() => {
    this.subscribe('bookings', this.selectedDay.get(), () => {
      const busyTimes = Bookings.find().fetch();
      // show all available timeslots for a given input (week)
      // assume work hours 8-16h including weekends, each time slot starts at full hour
      // booking can be max 8 hours long and cannot span across multiple days
      // the result array is to be assigned to a reactive variable called "timeSlots"
      // the html template is currently set to display the values as a text, but feel free to change it
      // if you want to keep it as text, it could look like this: ["8 - 10", "9 - 11", ...]
      // ... your code goes here

    })
  })
})



Template.availableTimes.helpers({
  days() {
    // return an array of following 5 working days (Mon-Fri) incl. today
    // ... your code goes here
    // hardcoded example:
    return ['2018-10-26', '2018-10-29', '2018-10-30', '2018-10-31', '2018-11-01']
  },

  hours: [1, 2, 3, 4, 5, 6, 7, 8],

  timeSlots() {
    return Template.instance().timeSlots.get()
  },

  bookings() {
    return Bookings.find().fetch();
  },

  formatDate(date, format) {
    return moment(date).format(format);
  },

  selectedDay() {
    return Template.instance().selectedDay.get();
  },
});



Template.availableTimes.events({
  'click #findTimeSlots'(e, t) {
    t.selectedDay.set($('#selectedDay').val());
  },

  'click .timeSlotSelect'(e, t) {
    e.preventDefault();
    // finish the application by calling a server method to book the time slot
    // Meteor.call('bookTimeSlot', {day, from, to})
    // ... your code goes here
  },
});
