export interface ProfileData {
  name: string
  title: string
  photo: string
  details: {
    [key: string]: string
  }
  about: string
}
