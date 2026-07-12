import { useEffect, useRef } from "react";
import "./JoinChat.css";

function JoinChat({
  username,
  roomId,
  setUsername,
  setRoomId,
  joinRoom,
}) {
  const pageRef = useRef(null);

  useEffect(() => {
    let animationFrameId;

    const updateScrollAnimation = () => {
      if (!pageRef.current) return;

      const scrollTop = window.scrollY;
      const pageHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

      const progress =
        pageHeight > 0
          ? Math.min(scrollTop / pageHeight, 1)
          : 0;

      pageRef.current.style.setProperty(
        "--scroll-progress",
        progress
      );

      pageRef.current.style.setProperty(
        "--blob-one-y",
        `${progress * 300}px`
      );

      pageRef.current.style.setProperty(
        "--blob-two-y",
        `${progress * -240}px`
      );

      pageRef.current.style.setProperty(
        "--blob-three-y",
        `${progress * 210}px`
      );

      pageRef.current.style.setProperty(
        "--grid-y",
        `${progress * 130}px`
      );
    };

    const handleScroll = () => {
      cancelAnimationFrame(animationFrameId);

      animationFrameId = requestAnimationFrame(
        updateScrollAnimation
      );
    };

    updateScrollAnimation();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    joinRoom();
  };

  return (
    <section className="landing-page" ref={pageRef}>
      <div className="landing-background">
        <div className="landing-grid"></div>

        <div className="landing-blob landing-blob-one"></div>
        <div className="landing-blob landing-blob-two"></div>
        <div className="landing-blob landing-blob-three"></div>

        <div className="landing-orbit landing-orbit-one"></div>
        <div className="landing-orbit landing-orbit-two"></div>

        <span className="landing-particle particle-one"></span>
        <span className="landing-particle particle-two"></span>
        <span className="landing-particle particle-three"></span>
        <span className="landing-particle particle-four"></span>
        <span className="landing-particle particle-five"></span>
      </div>

      <div className="landing-screen">
        <nav className="landing-navbar">
          <a className="landing-brand" href="#top">
            <span className="landing-brand-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7.5 5.5h9a3.5 3.5 0 0 1 3.5 3.5v4a3.5 3.5 0 0 1-3.5 3.5h-4.2L8 19.5v-3H7.5A3.5 3.5 0 0 1 4 13V9a3.5 3.5 0 0 1 3.5-3.5Z" />
                <path d="M8.5 10h7M8.5 13h4.5" />
              </svg>
            </span>

            <span>
              Sync<span>Talk</span>
            </span>
          </a>

          <div className="landing-live-status">
            <span></span>
            Real-time connection
          </div>
        </nav>

        <main className="landing-hero" id="top">
          <div className="landing-content">
            <div className="landing-badge">
              <span className="landing-badge-dot"></span>
              Powered by Socket.IO
            </div>

            <h1>
              Conversations that
              <span> move instantly.</span>
            </h1>

            <p className="landing-description">
              Create a private room, invite your friends and
              start chatting in real time with a fast and
              modern communication experience.
            </p>

            <div className="landing-points">
              <div>
                <span>01</span>
                Instant messaging
              </div>

              <div>
                <span>02</span>
                Private chat rooms
              </div>

              <div>
                <span>03</span>
                Live online users
              </div>
            </div>
          </div>

          <div className="landing-form-wrapper">
            <div className="landing-card-glow"></div>

            <form
              className="landing-card"
              onSubmit={handleSubmit}
            >
              <div className="landing-card-top">
                <div className="landing-card-logo">S</div>

                <div>
                  <span className="landing-card-label">
                    Welcome to
                  </span>

                  <h2>SyncTalk</h2>
                </div>
              </div>

              <p className="landing-card-description">
                Enter your details below to join a private
                conversation.
              </p>

              <div className="landing-form-group">
                <label htmlFor="username">Your name</label>

                <div className="landing-input-wrapper">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4.5 20c.7-4.1 3.2-6.2 7.5-6.2s6.8 2.1 7.5 6.2" />
                  </svg>

                  <input
                    id="username"
                    type="text"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(event) =>
                      setUsername(event.target.value)
                    }
                    autoComplete="off"
                    maxLength={25}
                  />
                </div>
              </div>

              <div className="landing-form-group">
                <label htmlFor="roomId">Room ID</label>

                <div className="landing-input-wrapper">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 9h14M5 15h14M9 5 7 19M17 5l-2 14" />
                  </svg>

                  <input
                    id="roomId"
                    type="text"
                    placeholder="Example: room-101"
                    value={roomId}
                    onChange={(event) =>
                      setRoomId(event.target.value)
                    }
                    autoComplete="off"
                    maxLength={30}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="landing-join-button"
              >
                <span>Join conversation</span>

                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M14 7l5 5-5 5" />
                </svg>
              </button>

              <p className="landing-form-note">
                Share the same Room ID with another user to
                start chatting.
              </p>
            </form>
          </div>
        </main>

        <div className="landing-scroll-indicator">
          <span>Scroll to explore</span>

          <div className="landing-mouse">
            <i></i>
          </div>
        </div>
      </div>

      <section className="landing-middle-section">
        <div className="landing-middle-content">
          <span className="landing-middle-label">
            Built for real-time communication
          </span>

          <h2>
            Simple rooms. Instant messages.
            <span> Zero complexity.</span>
          </h2>

          <p>
            SyncTalk brings together React, Node.js and
            Socket.IO to provide a fast and smooth chat
            experience.
          </p>

          <div className="landing-tech-list">
            <span>React</span>
            <span>Vite</span>
            <span>Node.js</span>
            <span>Express</span>
            <span>Socket.IO</span>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-brand">
            <span className="landing-footer-logo">S</span>

            <div>
              <h3>SyncTalk</h3>
              <p>Real-time chat made simple.</p>
            </div>
          </div>

          <div className="landing-footer-stack">
            <span>Built with</span>

            <div>
              <span>React</span>
              <span>Node.js</span>
              <span>Socket.IO</span>
            </div>
          </div>

          <div className="landing-footer-credit">
            <span>Designed & developed by</span>
            <strong>Huzaifa Akbar</strong>
          </div>
        </div>

        <div className="landing-footer-bottom">
          <span>© 2026 SyncTalk</span>
          <span>Fast • Private • Connected</span>
        </div>
      </footer>
    </section>
  );
}

export default JoinChat;