import axios from 'axios';
import { config } from 'dotenv';
import { Authflow } from 'prismarine-auth';

config();

const getToken = async () => {
  const flow = new Authflow(process.env["USERNAME"], undefined, { password: process.env["PASSWORD"], flow: 'msal' })
  const response = await flow.getMinecraftJavaToken()

  return response.token;
}

const modifySkin = async (variant: "slim"|"classic", url: string) => {
  axios.post(`https://api.minecraftservices.com/minecraft/profile/skins`, 
    {
      variant,
      url: url
    },
    {
      headers: {
        Authorization: "Bearer " + await getToken(),
        "Content-Type": "application/json"
      }
    }
  )
}

const hideCape = async () => {
  axios.delete(`https://api.minecraftservices.com/minecraft/profile/capes/active`, {
    headers: {
        Authorization: "Bearer " + await getToken()
      }
  })
}

const showCape = async (capeId: string) => {
  axios.put(`https://api.minecraftservices.com/minecraft/profile/capes/active`,
    {
      capeId
    },
    {
      headers: {
        Authorization: "Bearer " + await getToken(),
        "Content-Type": "application/json"
      }
    }
  )
}

const getAuccountInfo = async () => {
  const res = await axios.get<ProfileReponse>(`https://api.minecraftservices.com/minecraft/profile`, {
    headers: {
      Authorization: "Bearer " + await getToken(),
      "Content-Type": "application/json"
    }
  })
  return res.data;
}

interface ProfileReponse {
  id: string,
  name: string,
  skins: Skin[],
  capes: Cape[]
}

interface Skin {
  id: string,
  state: "ACTIVE",
  url: string,
  variant: "CLASSIC"|"SLIM"
}

interface Cape {
  id: string,
  state: "ACTIVE",
  url: string,
  alias: string
}