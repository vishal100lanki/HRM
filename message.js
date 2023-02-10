


const success = (message,data,extra=null) => {

    var reply = {
        status_code: 1,
        status_text: 'success',
        message:message,
        data:data
    };

    if(extra != null){
        Object.assign(reply, extra);
    }

    return reply;


}

const failed = (message) => ({
    status_code: 0,
    status_text: 'failed',
    message:message

});




export default {success,failed}