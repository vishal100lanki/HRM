const CANDIDATE_STATUS = [
    {
      key: 'pending',
      value: 'Pending'
    },
    {
        key: 'asigned',
        value: 'Asigned'
    },
    {
        key: 'selected',
        value: 'Selected'
    },
    {
        key: 'rejected',
        value: 'Rejected'
    }
];

const CandidateStatusKeys = (is_string = false) => {

    let array = CANDIDATE_STATUS.map(el => el.key);
    let string = array.toString();
    return is_string ? string : array ;
}


export { CANDIDATE_STATUS, CandidateStatusKeys } ;



