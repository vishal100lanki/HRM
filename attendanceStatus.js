const ATTENDANCE_STATUS = [
    {
      key: 'present',
      value: 'Present'
    },
    {
        key: 'absent',
        value: 'Absent'
    },
    {
      key: 'leave',
      value: 'Leave'
    },
    {
      key: 'short_leave',
      value: 'Short Leave'
    },
    {
        key: 'half_day',
        value: 'Half Day'
    },
];

const AttendanceStatusKeys = (is_string = false) => {

    let array = ATTENDANCE_STATUS.map(el => el.key);
    let string = array.toString();
    return is_string ? string : array ;

  }


const ABSENTS = ['absent', 'leave']; 
const LEAVE = ['short-leave', 'leave','half_day']; 
const dateToStamp = (date,time)=> {
  let full_date = date + ' ' + time;
  return Math.floor(new Date(full_date).getTime() / 1000);
}

export { ATTENDANCE_STATUS, AttendanceStatusKeys , ABSENTS , dateToStamp , LEAVE } ;