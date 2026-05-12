import { useState } from 'react'
import html2canvas from 'html2canvas'
import { getCurrentPersonality } from '../../utils/receipt'
import './PersonalityTeaser.css'

export default function PersonalityTeaser({ expenses, showToast }) {
  const [sharing, setSharing] = useState(false)
  const personality = getCurrentPersonality(expenses)

  if (!personality) return null

  const handleShare = async () => {
    setSharing(true)
    showToast('Generating card…')

    try {
      // Create a temporary card element to capture
      const card = document.createElement('div')
      card.style.cssText = `
        position: fixed;
        top: -9999px;
        left: 0;
        width: 390px;
        background: #1C1409;
        border-radius: 24px;
        padding: 32px 28px;
        font-family: 'Gabarito', sans-serif;
      `
      card.innerHTML = `
        <div style="display:flex;align-items:center;gap:4px;margin-bottom:4px;">
          <span style="font-size:20px;font-weight:700;color:#fff;letter-spacing:-0.01em;">spentt</span>
          <span style="width:6px;height:6px;border-radius:50%;background:#E8623A;display:inline-block;margin-bottom:1px;"></span>
        </div>
        <div style="font-size:10px;color:rgba(255,255,255,0.3);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:28px;">know where it went</div>
        <div style="font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">This week's personality</div>
        <div style="font-size:26px;font-weight:700;color:#fff;margin-bottom:10px;line-height:1.2;">${personality.personality}</div>
        <div style="font-size:14px;color:rgba(255,255,255,0.55);line-height:1.6;margin-bottom:28px;">${personality.line1}<br/>${personality.line2}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:16px;border-top:1px solid rgba(255,255,255,0.08);">
          <div style="display:flex;align-items:center;gap:4px;">
            <span style="font-size:14px;font-weight:700;color:rgba(255,255,255,0.25);">spentt</span>
            <span style="width:5px;height:5px;border-radius:50%;background:#E8623A;opacity:0.4;display:inline-block;"></span>
          </div>
          <span style="font-size:11px;color:rgba(255,255,255,0.18);letter-spacing:0.04em;">spentt.live</span>
        </div>
      `
      document.body.appendChild(card)

      const canvas = await html2canvas(card, {
        scale: 3,
        backgroundColor: '#1C1409',
        logging: false,
        useCORS: true,
      })

      document.body.removeChild(card)

      canvas.toBlob(async (blob) => {
        const file = new File([blob], 'my-spending-personality.png', { type: 'image/png' })
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `I'm a ${personality.personality} this week`,
            text: `${personality.line1} ${personality.line2} — spentt.live`,
          })
        } else {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'my-spending-personality.png'
          a.click()
          URL.revokeObjectURL(url)
          showToast('Image downloaded!')
        }
      }, 'image/png')
    } catch (err) {
      showToast('Could not generate card')
      console.error(err)
    } finally {
      setSharing(false)
    }
  }

  return (
    <div className="personality-teaser">
      <div className="pt-left">
        <div className="pt-label">This week's personality</div>
        <div className="pt-name">{personality.personality}</div>
        <div className="pt-sub">{personality.line1}</div>
      </div>
      <button
        className="pt-share-btn"
        onClick={handleShare}
        disabled={sharing}
      >
        {sharing ? '…' : '⬆ Share'}
      </button>
    </div>
  )
}