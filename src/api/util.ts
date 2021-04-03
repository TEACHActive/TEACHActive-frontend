const BASE_URL = "http://teachactive.engineering.iastate.edu:5000";

const getAxiosConfig = (method: "post" | "get", endpoint: string, data: any) => {
    return (
        {
            method: method,
            url: `${BASE_URL}${endpoint}`,
            headers: { 
              'Authorization': 'Basic ZWR1c2Vuc2U6b25seUZvckRldmVsb3BtZW50RG9Ob3RVc2VEZWZhdWx0UGFzc3dvcmRJblByb2R1Y3Rpb24=', 
              'Content-Type': 'application/json'
            },
            data : data
        }
    )
  };

export {getAxiosConfig}