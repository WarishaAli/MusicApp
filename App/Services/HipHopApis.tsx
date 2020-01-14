import {create as apicreate} from "apisauce";
import {HipHopApi} from "./Api";
import { IUserData, IUserRequest } from "../Lib/Interfaces";
import { from } from "rxjs";


export default (baseURL = `http://app.hiphopstreets.com/mobileServices`): HipHopApi => {

    const api = apicreate({
        baseURL,
        headers: {
            "Cache-Control": "no-cache",
            // "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            "Content-Type": "application/json",
          },
        //   20 second timeout...
          timeout: 20000,
        });
        const login = (params: IUserRequest) => from(api.post(`/login`, {
            socialtype: params.socialType,
            device_id: params.deviecId,
            devicetype: params.deviceType,
            email_id: params.emailId,
            password: params.password
        }));
        const getSongByCat = () => from(api.get(`getsongbycat?song_category=Trap`));


        return{
            login,
            getSongByCat,
        }
};