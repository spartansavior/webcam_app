import { useRef, useState } from 'react'
import './App.css'
import SailorMoonGirl, { type Clothing, type Mood } from './SailorMoonGirl'

type Status = 'idle' | 'loading' | 'error'

const MOODS: Mood[] = ['happy', 'shy', 'surprised', 'wink', 'sleepy']
const CLOTHING_STYLES: Clothing[] = ['uniform', 'dress', 'casual']

const BACKGROUND_SCOUTS: { color: string; mood: Mood; clothing: Clothing; className: string }[] = [
  { color: '#ff6fa5', mood: 'happy', clothing: 'uniform', className: 'scout-1' },
  { color: '#8c5cf0', mood: 'shy', clothing: 'dress', className: 'scout-2' },
  { color: '#4fb8ee', mood: 'wink', clothing: 'casual', className: 'scout-3' },
]

function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [cameraOn, setCameraOn] = useState(false)
  const [photo, setPhoto] = useState<string | null>(null)
  const [reading, setReading] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  const [scoutColor, setScoutColor] = useState('#ff6fa5')
  const [scoutMood, setScoutMood] = useState<Mood>('happy')
  const [scoutClothing, setScoutClothing] = useState<Clothing>('uniform')

  async function startCamera() {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraOn(true)
    } catch {
      setError("Couldn't reach your webcam. Check camera permissions and try again!")
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setCameraOn(false)
  }

  function capturePhoto() {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    if (!video.videoWidth || !video.videoHeight) {
      setError("Camera's still warming up~ give it a sec and try again!")
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    setPhoto(canvas.toDataURL('image/png'))
    setReading(null)
    setError(null)
  }

  async function askAI() {
    if (!photo) {
      setError('Take a snapshot first, then ask me! 💫')
      return
    }
    setStatus('loading')
    setError(null)
    setReading(null)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: photo }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')
      setReading(data.text)
      setStatus('idle')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStatus('error')
    }
  }

  return (
    <div className="moon-page">
      <div className="sparkle-field" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} className={`sparkle sparkle-${i % 6}`}>
            {i % 3 === 0 ? '✨' : i % 3 === 1 ? '💖' : '⭐'}
          </span>
        ))}
      </div>

      <div className="scout-field" aria-hidden="true">
        {BACKGROUND_SCOUTS.map((scout) => (
          <SailorMoonGirl
            key={scout.className}
            color={scout.color}
            mood={scout.mood}
            clothing={scout.clothing}
            size={130}
            className={scout.className}
          />
        ))}
      </div>

      <header className="moon-header">
        <h1>🌙 Moon Prism Cam 💕</h1>
        <p className="tagline">Snap a photo, and let AI tell you what it sees!</p>
      </header>

      <main className="stage">
        <div className="video-frame">
          <video ref={videoRef} autoPlay playsInline muted style={{ display: cameraOn ? 'block' : 'none' }} />
          {!cameraOn && (
            <div className="video-placeholder">
              <span>🎀</span>
              <p>Camera's asleep~ hit the button to wake it up!</p>
            </div>
          )}
        </div>

        {photo && (
          <div className="photo-frame">
            <p className="frame-label">Your snapshot</p>
            <img src={photo} alt="Captured snapshot" />
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <div className="button-row">
          <button
            type="button"
            className="moon-btn camera-btn"
            onClick={cameraOn ? stopCamera : startCamera}
          >
            <span className="btn-icon">📷</span>
            {cameraOn ? 'Stop Camera' : 'Start Camera'}
          </button>

          <button
            type="button"
            className="moon-btn capture-btn"
            onClick={capturePhoto}
            disabled={!cameraOn}
          >
            <span className="btn-icon">📸</span>
            Capture
          </button>

          <button
            type="button"
            className="moon-btn ai-btn"
            onClick={askAI}
            disabled={status === 'loading'}
          >
            <span className="btn-icon anime-girl" aria-hidden="true">
              <span className="hair" />
              <span className="face">
                <span className="eye eye-left" />
                <span className="eye eye-right" />
                <span className="blush blush-left" />
                <span className="blush blush-right" />
              </span>
              <span className="bow" />
            </span>
            {status === 'loading' ? 'Thinking...' : 'Ask AI'}
          </button>
        </div>

        {error && <p className="error-text">⚠️ {error}</p>}

        {reading && (
          <div className="speech-bubble">
            <p>{reading}</p>
          </div>
        )}

        <div className="scout-creator">
          <h2>Create Your Sailor Scout 💫</h2>
          <div className="scout-creator__body">
            <SailorMoonGirl color={scoutColor} mood={scoutMood} clothing={scoutClothing} size={140} />

            <div className="scout-creator__controls">
              <label>
                Color
                <input
                  type="color"
                  value={scoutColor}
                  onChange={(e) => setScoutColor(e.target.value)}
                />
              </label>

              <label>
                Mood
                <select value={scoutMood} onChange={(e) => setScoutMood(e.target.value as Mood)}>
                  {MOODS.map((mood) => (
                    <option key={mood} value={mood}>
                      {mood}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Clothing
                <select
                  value={scoutClothing}
                  onChange={(e) => setScoutClothing(e.target.value as Clothing)}
                >
                  {CLOTHING_STYLES.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>
      </main>

      <footer className="moon-footer">
        <p>In the name of the moon, I'll analyze this photo! 🌙</p>
      </footer>
    </div>
  )
}

export default App
