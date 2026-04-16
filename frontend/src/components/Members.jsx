import React, { useEffect, useState } from 'react'
import './Members.css';

const SAMPLE = [
  { id: 'm1', name: 'Veera Muthu Prakash S', role: 'President', avatar: '/avatars/vm.png', linkedin: 'https://linkedin.com/in/veera-muthu-prakash-swaminathan-a15a4b291', github: 'https://github.com/vmprakash-swaminathan' },
  { id: 'm2', name: 'Ajayan S', role: 'Vice President', avatar: '/avatars/ajayan.jpg', linkedin: 'https://www.linkedin.com/in/ajayan-suresh-1479902a2', github: '' },
  { id: 'm3', name: 'Abishek M', role: 'Secretary', avatar: '/avatars/abishek.png', linkedin: 'https://linkedin.com/in/abishekmurugesan14', github: '' },
  { id: 'm4', name: 'Lithika Shree P', role: 'Joint Secretary', avatar: '/avatars/lithika.jpg', linkedin: 'https://www.linkedin.com/in/lithika-shree-7907bb2a3', github: '' },
  { id: 'm5', name: 'Gowri R', role: 'Treasurer', avatar: '/avatars/gowri.jpg', linkedin: 'https://www.linkedin.com/in/gowri-r-ramesh-2649962a2', github: '' },
  { id: 'm6', name: 'Atchaya S', role: 'Joint Treasurer', avatar: '/avatars/atchaya.jpg', linkedin: 'https://www.linkedin.com/in/atchaya-shanmugamoorthy-5278853a7', github: 'https://github.com/atchaya234'},
  { id: 'm7', name: 'Josuva J', role: 'Technical Lead', avatar: '/avatars/josuva-j.jpg', linkedin: 'https://linkedin.com/in/josuva-anand-271427291', github: 'https://github.com/JosuvaAnand' },
  { id: 'm8', name: 'Harish SS', role: 'Technical Core Member', avatar: '/avatars/harishss.png', linkedin: 'https://www.linkedin.com/in/harish-harish-181539292', github: ''},
  { id: 'm9', name: 'Easter Raj', role: 'Technical Core Member', avatar: '/avatars/easter.jpg', linkedin: 'https://www.linkedin.com/in/p-s-easter-raj-85a638299', github: ''},
  { id: 'm10', name: 'Logeshwaran M', role: 'Technical Core Member', avatar: '/avatars/logesh.jpg', linkedin: 'https://www.linkedin.com/in/logeshwaran-logesh-00209637a', github: ''},
  { id: 'm11', name: 'Navinesh S', role: 'Technical Core Member', avatar: '/avatars/navinesh.jpg', linkedin: 'https://www.linkedin.com/in/navinesh-s-2073b7324', github: ''},
  { id: 'm12', name: 'Deepika E', role: 'Non-Technical Committee', avatar: '/avatars/Deepika.jpg', linkedin: 'https://www.linkedin.com/in/deepika-eswaran-a737b72a3', github: ''},
  { id: 'm13', name: 'Sweatha R', role: 'Non-Technical Committee', avatar: '/avatars/Sweatha.R.jpg', linkedin: 'https://www.linkedin.com/in/sweatha-r-10398a2a2', github: 'https://github.com/SWEA2105'},
  { id: 'm14', name: 'Saranya Devi S', role: 'Non-Technical Committee', avatar: '/avatars/saranya.jpg', linkedin: '', github: ''},
  { id: 'm15', name: 'Sham J', role: 'Non-Technical Committee', avatar: '/avatars/Sham.J.png', linkedin: 'https://www.linkedin.com/in/sham-justin-875b7a328', github: ''},
  { id: 'm16', name: 'Vijaya Shree M V', role: 'Event Coordinator Head', avatar: '/avatars/Viji.png', linkedin: 'https://www.linkedin.com/in/vijaya-shree-0a8a76224', github: ''},
  { id: 'm17', name: 'Harish K', role: 'Event Coordinators', avatar: '/avatars/Harish.K.png', linkedin: 'https://www.linkedin.com/in/harish-kannusamy-110166386', github: ''},
  { id: 'm18', name: 'Sandhiya S', role: 'Event Coordinators', avatar: '/avatars/sandhiya.png', linkedin: 'https://www.linkedin.com/in/sandhiya-s-9a49982a2', github: ''},
  { id: 'm19', name: 'Mohana Priya G', role: 'Event Coordinators', avatar: '/avatars/MohanaPriya.jpg', linkedin: 'https://www.linkedin.com/in/mohana-priya-047b25364', github: ''},
  { id: 'm20', name: 'Shriram M', role: 'Event Coordinators', avatar: '/avatars/shriram.png', linkedin: 'https://www.linkedin.com/in/m-shriram-8a645b394', github: ''},
  { id: 'm21', name: 'Vaishnavi P', role: 'Documentation Committee', avatar: '/avatars/vaishnavi.png', linkedin: 'https://www.linkedin.com/in/vaishnavi-prakash-435382294', github: 'https://github.com/Vaishprakash123'},
  { id: 'm22', name: 'Dhivya P', role: 'Documentation Committee', avatar: '/avatars/Dhivya.png', linkedin: 'https://www.linkedin.com/in/dhivya-palanisamy-9388072a3', github: ''},
  { id: 'm23', name: 'Sridhar', role: 'Documentation Committee', avatar: '/avatars/sridhar.png', linkedin: 'https://www.linkedin.com/in/sridhar-srija-a65296293', github: ''},
  { id: 'm24', name: 'Vishva R', role: 'Documentation Committee', avatar: '/avatars/Vishwa.R.png', linkedin: 'http://www.linkedin.com/in/vishva-tech', github: ''},
  { id: 'm25', name: 'Balamurugan C', role: 'Chief Editor', avatar: '/avatars/bala.png', linkedin: 'https://linkedin.com/in/balamurugan-c-5507b82a3', github: 'https://github.com/Balamurugan0113' },
  { id: 'm26', name: 'Yaswanth S', role: 'Associate Editor', avatar: '/avatars/Yash.png', linkedin: 'https://www.linkedin.com/in/yaswanth-sachithananthan-950276320', github: ''},
  { id: 'm27', name: 'Shaheer A', role: 'Design Head', avatar: '/avatars/Shaheer.png', linkedin: 'https://www.linkedin.com/in/shaheer-naz-5766133a8', github: ''},
  { id: 'm28', name: 'Santhosh Bharathi L', role: 'Creative Head', avatar: '/avatars/santhosh.jpg', linkedin: 'https://www.linkedin.com/in/santhosh-barathi-32918a330', github: ''},
  { id: 'm29', name: 'Harishragavendraa M', role: 'PRO', avatar: '/avatars/Ragavendra.png', linkedin: 'www.linkedin.com/in/harishragavendraa', github: ''},
  { id: 'm30', name: 'Kamalesh V', role: 'PRO', avatar: '/avatars/Kamalesh.jpg', linkedin: 'https://www.linkedin.com/in/kamalesh-kamalesh-9b37b62a3', github: ''},
  { id: 'm31', name: 'Hakeem', role: 'PRO', avatar: '/avatars/Hakeem.jpg', linkedin: 'https://www.linkedin.com/in/hakeem-musthafa-2162a6387', github: ''},
  { id: 'm32', name: 'Nithiya Sri', role: 'Student Executive', avatar: '/avatars/nithya.png', linkedin: 'https://www.linkedin.com/in/nithiya-sri-c-5119972a2', github: ''},
  { id: 'm33', name: 'Nijanthan Nehemiah S', role: 'Student Executive', avatar: '/avatars/Nijanthan.jpg', linkedin: 'https://www.linkedin.com/in/nijanthan-nehemiah-690478353', github: ''},
]
export { SAMPLE };

// toggle API usage via VITE_USE_API_MEMBERS=false in .env
const USE_API = (import.meta.env.VITE_USE_API_MEMBERS ?? 'true') !== 'false'

const toExternal = (url) => {
  if (!url) return ''
  return /^https?:\/\//i.test(url) ? url : `https://${url.replace(/^\/+/, '')}`
}

const resolveAvatar = (src) => {
  if (!src) return ''
  if (/^https?:\/\//i.test(src)) return src
  const normalized = src.startsWith('/') ? src : `/avatars/${src}`
  return normalized.replace(/ /g, '%20')
}

const initials = (name = '') =>
  name.trim().split(/\s+/).slice(0,2).map(s => s[0]?.toUpperCase() || '').join('')

export default function Members({ apiBase = '' }) {
  const [members, setMembers] = useState(() => sortById(SAMPLE))
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (!USE_API) return
    fetch(`${apiBase}/api/members`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => {
        if (!Array.isArray(d) || !d.length) return
        const byName = Object.fromEntries(SAMPLE.map(m => [m.name.trim().toLowerCase(), m]))
        const merged = d.map(m => {
          const key = (m.name || '').trim().toLowerCase()
          const base = byName[key] || {}
          return {
            ...base,
            ...m,
            avatar: m.avatar || base.avatar || '',
            linkedin: toExternal(m.linkedin || base.linkedin || ''),
            github: toExternal(m.github || base.github || '')
          }
        })
        setMembers(sortById(merged))
      })
      .catch(()=>{}) // keep SAMPLE on failure
  }, [apiBase])

  function sortById(list) {
    return [...list].sort((a, b) => {
      const ai = parseInt((a.id || '').replace(/\D/g, ''), 10) || 0
      const bi = parseInt((b.id || '').replace(/\D/g, ''), 10) || 0
      if (ai !== bi) return ai - bi
      return (a.name || '').localeCompare(b.name || '')
    })
  }

  const openModal = (member) => { setSelected(member); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setSelected(null) }

  const onCardKey = (e, m) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openModal(m)
    }
  }

  return (
    <section id="members" className="section members-section" aria-labelledby="members-heading">
      <div className="container">

        <div className="members-grid" role="list">
          {members.map((m) => {
            const avatar = resolveAvatar(m.avatar)
            return (
              <article
                key={m.id || m.name}
                className="member-card centered"
                role="listitem"
                aria-label={`${m.name} — ${m.role}`}
                onKeyDown={(e) => onCardKey(e, m)}
                tabIndex={0}
                onClick={() => openModal(m)}
              >
                <div className="avatar-center">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={`${m.name} avatar`}
                      className="avatar-img-center"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                      loading="lazy"
                    />
                  ) : (
                    <div className="avatar-fallback-center">{initials(m.name)}</div>
                  )}
                </div>

                <div className="meta-center">
                  <div className="member-name-neon" aria-hidden="false">{m.name}</div>
                  <div className="member-role-glass">{m.role}</div>

                  <div className="links-center" aria-hidden="false">
                    {m.linkedin && (
                      <a className="icon-chip" href={m.linkedin} target="_blank" rel="noopener noreferrer" onClick={(e)=>e.stopPropagation()}>
                        LinkedIn
                      </a>
                    )}
                    {m.github && (
                      <a className="icon-chip" href={m.github} target="_blank" rel="noopener noreferrer" onClick={(e)=>e.stopPropagation()}>
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {modalOpen && selected && (
        <div
          className="member-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={closeModal}
        >
          <div className="member-modal centered" role="document" onClick={(e)=>e.stopPropagation()}>
            <header className="modal-header">
              <img src={resolveAvatar(selected.avatar)} alt="" className="modal-avatar" onError={(e)=>e.currentTarget.style.display='none'} />
              <div>
                <h3 id="modal-title" className="modal-name neon-inline">{selected.name}</h3>
                <div className="modal-role glass-inline">{selected.role}</div>
              </div>
              <button aria-label="Close" className="modal-close" onClick={closeModal}>✕</button>
            </header>

            <div className="modal-actions">
              {selected.linkedin && <a className="btn small" href={selected.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
              {selected.github && <a className="btn small" href={selected.github} target="_blank" rel="noreferrer">GitHub</a>}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
