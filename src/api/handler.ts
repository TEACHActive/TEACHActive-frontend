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
  updateMetric(
    sessionId: string,
    metricName: string,
    newMetricObj: object
  ): Promise<boolean>;
  getSessionExtras(sessionId: string): Promise<object>;
  getSessionReflections(sessionID: string, uid: string): Promise<any | null>;
  updateSessionReflections(
    sessionID: string,
    uid: string,
    userSessionReflections?: any[]
  ): Promise<boolean>;
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
      return [];
    }
  };

  getSessionsByUID = async (uid: string): Promise<BaseSession[]> => {
    console.log("getSessionsByUID");
    console.log(uid);

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
    console.log(config);

    try {
      const response = await axios.request(config);
      console.log(response);

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

      const edusenseResponse = JSON.parse(response.data.response);

      const videoFrameSessionResponse = new SessionResponse<VideoFrameSession>(
        {
          sessions:
            edusenseResponse && edusenseResponse.data
              ? edusenseResponse.data.sessions
              : [],
          success: response.data.success,
        },
        VideoFrameSession
      );
      if (!videoFrameSessionResponse.success) {
        message.error("An error occured");
      }

      console.log(videoFrameSessionResponse.sessions);

      return videoFrameSessionResponse.sessions;
    } catch (e) {
      console.error(e);
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

    console.log(newMetricObj);

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
  async getSessionReflections(
    sessionId: string,
    uid: string
  ): Promise<object | null> {
    const config = getAxiosConfig(
      "get",
      `/reflections/${uid}/${sessionId}`,
      "teachactive"
    );

    try {
      const response = await axios.request(config);
      console.log(response);

      if (response.data.error) {
        // message.error("An error occured");
        console.error(response.data.detail);
        return null;
      }

      return response.data;
    } catch (e) {
      console.error(e);
      // message.error("There was an error");
      return null;
    }
  }
  async updateSessionReflections(
    sessionId: string,
    uid: string,
    userSessionReflections: any[] = []
  ): Promise<boolean> {
    const config = getAxiosConfig(
      "put",
      `/reflections/${uid}/${sessionId}`,
      "teachactive",
      {
        userId: uid,
        sessionId: sessionId,
        reflections: userSessionReflections,
      }
    );

    try {
      const response = await axios.request(config);

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
  }
}

const apiHandler: IAPIHandler = new APIHandler();

export default apiHandler;
