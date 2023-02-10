const INTERVIEW_STATUS = [
    {
      key: 'selected',
      value: 'Selected'
    },
    {
        key: 'rejected',
        value: 'Rejected'
    },
    {
      key: 'pending',
      value: 'Pending'
    }
];

const InterviewStatusKeys = (is_string = false) => {

    let array = INTERVIEW_STATUS.map(el => el.key);
    let string = array.toString();
    return is_string ? string : array ;
}
export { INTERVIEW_STATUS, InterviewStatusKeys} ;