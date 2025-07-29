export interface Skill {
  name: string
  level: number
}

export interface AnimatedSkill extends Skill {
  animatedLevel: number
}
