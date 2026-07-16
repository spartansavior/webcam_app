import './SailorMoonGirl.css'

export type Mood = 'happy' | 'shy' | 'surprised' | 'wink' | 'sleepy'
export type Clothing = 'uniform' | 'dress' | 'casual'

interface SailorMoonGirlProps {
  color?: string
  mood?: Mood
  clothing?: Clothing
  size?: number
  className?: string
}

function Face({ mood }: { mood: Mood }) {
  switch (mood) {
    case 'happy':
      return (
        <>
          <span className="sm-eye sm-eye-happy sm-eye-left" />
          <span className="sm-eye sm-eye-happy sm-eye-right" />
          <span className="sm-blush sm-blush-left" />
          <span className="sm-blush sm-blush-right" />
          <span className="sm-mouth sm-mouth-smile" />
        </>
      )
    case 'shy':
      return (
        <>
          <span className="sm-eye sm-eye-dot sm-eye-left" />
          <span className="sm-eye sm-eye-dot sm-eye-right" />
          <span className="sm-blush sm-blush-left sm-blush-big" />
          <span className="sm-blush sm-blush-right sm-blush-big" />
          <span className="sm-mouth sm-mouth-o" />
        </>
      )
    case 'surprised':
      return (
        <>
          <span className="sm-eye sm-eye-round sm-eye-left" />
          <span className="sm-eye sm-eye-round sm-eye-right" />
          <span className="sm-blush sm-blush-left" />
          <span className="sm-blush sm-blush-right" />
          <span className="sm-mouth sm-mouth-o sm-mouth-big" />
        </>
      )
    case 'wink':
      return (
        <>
          <span className="sm-eye sm-eye-happy sm-eye-left" />
          <span className="sm-eye sm-eye-dot sm-eye-right" />
          <span className="sm-blush sm-blush-left" />
          <span className="sm-blush sm-blush-right" />
          <span className="sm-mouth sm-mouth-smirk" />
        </>
      )
    case 'sleepy':
      return (
        <>
          <span className="sm-eye sm-eye-happy sm-eye-left sm-eye-flat" />
          <span className="sm-eye sm-eye-happy sm-eye-right sm-eye-flat" />
          <span className="sm-blush sm-blush-left" />
          <span className="sm-blush sm-blush-right" />
          <span className="sm-mouth sm-mouth-flat" />
        </>
      )
  }
}

export default function SailorMoonGirl({
  color = '#ff6fa5',
  mood = 'happy',
  clothing = 'uniform',
  size = 120,
  className = '',
}: SailorMoonGirlProps) {
  return (
    <div
      className={`sm-girl sm-girl--${clothing} ${className}`}
      style={{ width: size, height: size * 1.6, ['--sm-accent' as string]: color }}
    >
      <span className="sm-ponytail sm-ponytail-left" />
      <span className="sm-ponytail sm-ponytail-right" />
      <span className="sm-bun sm-bun-left" />
      <span className="sm-bun sm-bun-right" />

      <div className="sm-head">
        <span className="sm-bangs" />
        <div className="sm-face">
          <Face mood={mood} />
        </div>
      </div>

      <div className="sm-body">
        {clothing === 'uniform' && <span className="sm-collar" />}
        {clothing === 'uniform' && <span className="sm-bow" />}
        {clothing === 'casual' && <span className="sm-hood" />}
        <span className="sm-torso" />
        {clothing === 'uniform' && <span className="sm-skirt" />}
        {clothing === 'casual' && <span className="sm-shorts" />}
      </div>

      <span className="sm-leg sm-leg-left" />
      <span className="sm-leg sm-leg-right" />
    </div>
  )
}
