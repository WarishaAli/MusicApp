import {create as apicreate} from "apisauce";
import {HipHopApi} from "./Api";
import { IUserData, IUserRequest } from "../Lib/Interfaces";
import { from } from "rxjs";


export default (): HipHopApi => {

    const api = apicreate({
        baseURL:`app.hiphopstreets.com/mobileServices`,
        headers: {
            "Cache-Control": "no-cache",
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          // 20 second timeout...
          timeout: 20000,
        });
        const login = (params: IUserRequest) => from(api.post(`/login`, {
            socialtype: params.socialType,
            device_id: params.deviecId,
            devicetype: params.deviceType,
            email_id: params.emailId,
            password: params.password
        }));
        return{
            login,
        }
};