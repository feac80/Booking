Template.availableTimes.onCreated(function() {
  this.timeSlots = new ReactiveVar();
  this.selectedDay = new ReactiveVar();
  this.selectedHour = new ReactiveVar(1);
});

Template.availableTimes.onRendered(function() {
  this.autorun(() => {
    this.subscribe(
      'bookings',
      this.selectedDay.get(),
      this.selectedHour.get(),

      () => {
        // show all available timeslots for a given input (week)
        // assume work hours 8-16h including , each time slot starts at full hour
        // booking can be max 8 hours long and cannot span across multiple days
        // the result array is to be assigned to a reactive variable called "timeSlots"
        // the html template is currently set to display the values as a text, but feel free to change it
        // if you want to keep it as text, it could look like this: ["8 - 10", "9 - 11", ...]
        // ... your code goes here

        // This function Extract the start time from the string [e.g "10-11" then return 10]
        const getStartTime = time => {
          let split = time.split('-');
          return split[0];
        };
        //Get all the existing bookings from the db collection filtered by the selected day.
        const busyTimes = Bookings.find({
          day: this.selectedDay.get()
        }).fetch();

        const availableTime = () => {
          // By default the AvailableHours array contains all available slot time, from 8:00 till 16:00. This function
          // remove from the array those slots time that have been already booked.
          //{    day: this.selectedDay.get()}

          function removeTimeSlot() {
            busyTimes.forEach(busytime => {
              availableHours.map((time, i) => {
                if (getStartTime(time) == busytime.from) {
                  availableHours.splice(i, busytime.hours);
                }
              });
              return availableHours;
            });
          }
          function chunkArray(availableHours, chunkSize) {
            let chunks = [],
              i = 0,
              n = availableHours.length;
            while (i < n) {
              chunks.push(availableHours.slice(i, (i += chunkSize)));
            }

            return chunks;
          }

          let availableHours = [
            '8-9',
            '9-10',
            '10-11',
            '11-12',
            '12-13',
            '13-14',
            '14-15',
            '15-16'
          ];

          removeTimeSlot();
          let requiredHours = this.selectedHour.get();
          let totalHoursAvailable = availableHours.length;

          if (requiredHours > totalHoursAvailable) {
            return [
              `There is/are not ${requiredHours} hr/hrs available on (${this.selectedDay.get()})`
            ];
          } else {
            return chunkArray(availableHours, requiredHours);
          }

          //return availableHours;
        };

        this.timeSlots.set(availableTime());
      }
    );
  });
});

Template.availableTimes.helpers({
  days() {
    // return an array of following 5 working days (Mon-Fri) incl. today
    // return true if the current date(d) is within a weekend
    let isItWeekEnd = d => {
      if (d.getDay() == 0 || d.getDay() == 6) {
        return true;
      } else {
        return false;
      }
    };
    //return an array with next five working days since todays's date
    let findWeekDays = () => {
      let nextFiveWorkingDays = [],
        date = new Date(),
        i = 0;

      do {
        let curdate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + i
        );
        if (!isItWeekEnd(curdate)) {
          nextFiveWorkingDays.push(curdate);
        }
        i++;
      } while (nextFiveWorkingDays.length < 5);
      return nextFiveWorkingDays;
    };

    return findWeekDays();
  },

  hours: [1, 2, 3, 4, 5, 6, 7, 8],

  timeSlots() {
    return Template.instance().timeSlots.get();
  },

  selectedHour() {
    return Template.instance().selectedHour.get();
  },
  bookings() {
    return Bookings.find().fetch();
  },

  formatDate(date, format) {
    return moment(date).format(format);
  },

  selectedDay() {
    return Template.instance().selectedDay.get();
  }
});

Template.availableTimes.events({
  'click #findTimeSlots'(e, t) {
    t.selectedDay.set($('#selectedDay').val());
  },

  'click .timeSlotSelect'(e, t) {
    let array = e.currentTarget.text.split('-');
    let from = array[0];
    let to = array[array.length - 1];
    let day = t.selectedDay.get();
    let hours = Number(to) - Number(from);

    t.selectedDay.set(0);
    t.selectedDay.set($('#selectedDay').val());
    // t.selectedHour.set(0);
    // t.selectedHour.set($('#hourCount').val());
    //

    e.preventDefault();
    // finish the application by calling a server method to book the time slot
    Meteor.call('bookTimeSlot', { day, from, to, hours });
    // ... your code goes here
  },
  'change #hourCount': function(e, t) {
    // var category = $(e.currentTarget).val();
    t.selectedHour.set($(e.currentTarget).val());
  }
});
