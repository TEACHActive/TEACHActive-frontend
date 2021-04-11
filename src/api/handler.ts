import { message } from "antd";
import axios from "axios";
import { BaseSession, SessionResponse, VideoFrameSession } from "./types";
import { getAxiosConfig } from "./util";

export interface IAPIHandler {
  getAllSessionIDs(): Promise<BaseSession[]>;
  getSessionsByUID(uid: string): Promise<BaseSession[]>;
  getFramesBySessionID(
    sessionID: string,
    channel: "student" | "instructor"
  ): Promise<VideoFrameSession[]>;
  // updateSessionName(sessionId: string, newName: string): Promise<boolean>;
  // updateSessionPerformance(
  //   sessionId: string,
  //   newPerformance: number
  // ): Promise<boolean>;
  updateMetric(
    sessionId: string,
    metricName: string,
    newMetricObj: object
  ): Promise<boolean>;
  getSessionExtras(sessionId: string): Promise<object>;
}

export class APIHandler implements IAPIHandler {
  getAllSessionIDs = async (): Promise<BaseSession[]> => {
    const data = JSON.stringify({
      query: `{
                sessions {
                    id
                    createdAt {
                        unixSeconds
                    }
                }
            }`,
      variables: {},
    });

    const config = getAxiosConfig("post", "/query", "edusense", data);

    try {
      const response = await axios.request(config);

      const baseSessionResponse = new SessionResponse<BaseSession>(
        {
          sessions: JSON.parse(response.data.response).data.sessions,
          success: response.data.success,
        },
        BaseSession
      );
      if (!baseSessionResponse.success) {
        message.error("An error occured");
      }
      return baseSessionResponse.sessions;
    } catch (e) {
      console.error(e);
      message.error(e);
      return [];
    }
  };

  getSessionsByUID = async (uid: string): Promise<BaseSession[]> => {
    const data = JSON.stringify({
      query: `{
                sessions(keyword: "${uid}") { 
                    id
                    createdAt {
                        unixSeconds
                    }
                }
            }`,
      variables: {},
    });

    const config = getAxiosConfig("post", "/query", "edusense", data);

    try {
      const response = await axios.request(config);

      const baseSessionResponse = new SessionResponse<BaseSession>(
        {
          sessions: JSON.parse(response.data.response).data.sessions,
          success: response.data.success,
        },
        BaseSession
      );
      if (!baseSessionResponse.success) {
        message.error("An error occured");
      }
      return baseSessionResponse.sessions;
    } catch (e) {
      console.error(e);
      message.error("There was an error");
      return [];
    }
  };

  getFramesBySessionID = async (
    sessionID: string,
    channel: "student" | "instructor"
  ): Promise<VideoFrameSession[]> => {
    var data = JSON.stringify({
      query: `{
              sessions(sessionId: "${sessionID}") { 
                  id
                  createdAt { 
                    unixSeconds
                  }
                  videoFrames(schema: "0.1.0", channel: ${channel}) { 
                      frameNumber
                      timestamp {
                          unixSeconds
                      }
                      people { 
                          openposeId 
                          body
                          inference { 
                              trackingId 
                              posture { 
                                  armPose 
                                  sitStand
                              }
                          }
                      } 
                  }
              }
          }`,
      variables: {},
    });

    const config = getAxiosConfig("post", "/query", "edusense", data);

    try {
      const response = await axios.request(config);

      const videoFrameSessionResponse = new SessionResponse<VideoFrameSession>(
        {
          sessions: JSON.parse(response.data.response).data.sessions,
          success: response.data.success,
        },
        VideoFrameSession
      );
      if (!videoFrameSessionResponse.success) {
        message.error("An error occured");
      }

      return videoFrameSessionResponse.sessions;
    } catch (e) {
      console.error(e);
      message.error(e);
      return [];
    }
  };

  updateMetric = async (
    sessionId: string,
    metricName: string,
    newMetricObj: object
  ): Promise<boolean> => {
    const config = getAxiosConfig(
      "put",
      `/edusense/sessions/${sessionId}/${metricName}`,
      "teachactive",
      newMetricObj
    );

    try {
      const response = await axios.request(config);
      console.log(response);

      if (response.data.error) {
        message.error("An error occured");
        console.error(response.data.detail);
        return false;
      }

      return true;
    } catch (e) {
      console.error(e);
      message.error("There was an error");
      return false;
    }
  };

  getSessionExtras = async (sessionId: string): Promise<object> => {
    const config = getAxiosConfig(
      "get",
      `/edusense/sessions/${sessionId}`,
      "teachactive"
    );

    try {
      const response = await axios.request(config);

      if (response.data.error) {
        message.error("An error occured");
        console.error(response.data.detail);
        return Promise.reject(response.data.error);
      }

      return {
        name: response.data.name,
        performance: response.data.performance,
      };
    } catch (e) {
      console.error(e);
      message.error("There was an error");
      return Promise.reject(e);
    }
  };
}

const apiHandler: IAPIHandler = new APIHandler();

export default apiHandler;
