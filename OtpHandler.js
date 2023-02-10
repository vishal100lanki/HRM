// <?php

// namespace App\Traits;

// use App\Models\Otp;
// use App\Traits\Reply;

// trait OtpHandler
// {
//     use Reply;
//     # Send Otp To email First
//     # Verify Email Otp
//     # Send Otp to mobile
//     # Verify mobile Otp and call function using params

//     public function SaveOtp($email ,$mobile ,$type , $sendType ,$callback = null , array $params = null)
//     {


//         $otp = rand(100000,999999);
//         $res = Otp::UpdateOrCreate(['email' => $email,'mobile' => $mobile],[
//             'otp_type' => $type,
//             'send_type' => $sendType,
//             'otp' => $otp,
//             'callback' => $callback ?? '',
//             'cb_params' => $params != null ? $this->setParams($params) : ''
//         ]);

//         return $res ? $res : 0 ;
//     }

//     public function VerifyOtp($email , $mobile ,$otp)
//     {
//         $otp = Otp::where(['email' => $email , 'mobile' => $mobile ,'otp' => $otp]);
//         if($otp->doesntExist())
//         {
//             return $this->failed('Incorrect Otp');
//         }

//         $otp_detail = $otp->first();
//         $callback_fun = $otp_detail->callback;
//         $cb_params = $otp_detail->cb_params;

//         # Validate Expiry
//         if($otp_detail->expired_at < now() )
//         {
//             return $this->failed('Otp Expired');
//         }


//         if($callback_fun != null || $callback_fun != '')
//         {
//             $otp->delete();
//             # Call User Function
//             return call_user_func([get_class($this), $callback_fun],$this->getParams($cb_params));
//         }

//         $otp->delete();
//         return $this->success('Verified Successfully');

//     }

//     public function getParams($params)
//     {
//         return json_decode($params);
//     }

//     public function setParams($params)
//     {
//         return json_encode($params);
//     }

// }

