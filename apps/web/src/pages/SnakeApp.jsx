import { createSignal, Show, onMount, onCleanup, createEffect } from "solid-js";
import { Dynamic } from "solid-js/web";

const WIDTH = 800;
const HEIGHT = 600;

// ======================================================
// Composant racine : sélection des modes + cheat code
// ======================================================

function SnakeApp() {
  const [selectedModeId, setSelectedModeId] = createSignal(null);
  const [absoluteUnlocked, setAbsoluteUnlocked] = createSignal(false);

  //   // Empêche le scroll quand un jeu est lancé
  // createEffect(() => {
  //   if (selectedModeId()) {
  //     document.body.style.overflow = "hidden";
  //   } else {
  //     document.body.style.overflow = "";
  //   }
  // });

  // // Au cas où le composant est démonté, on rétablit le scroll
  // onCleanup(() => {
  //   document.body.style.overflow = "";
  // });

  const [showCheatInput, setShowCheatInput] = createSignal(false);
  const [cheatInput, setCheatInput] = createSignal("");
  const [cheatMessage, setCheatMessage] = createSignal("");

  const gameModes = [
    {
      id: "classic",
      label: "Snake Classique",
      description:
        "Logo Linux comme nourriture, ennemis Apple / Windows qui réduisent ta taille. Objectif : remplir tout le terrain.",
      requiresUnlock: false,
      logo: "/linux.png",
      component: ClassicSnake,
    },
    {
      id: "obstacles",
      label: "Snake Obstacles",
      description:
        "Snake sur grille avec obstacles aléatoires. Linux à manger, Apple / Windows comme ennemis. Objectif : remplir l'espace libre.",
      requiresUnlock: false,
      logo: "/linux.png",
      component: ObstaclesSnake,
    },
    {
      id: "absolute",
      label: "Absolute Snake (mode caché)",
      description:
        "Version parodique avec bouteilles et barils. Snake sinusoïdal, tête qui rougit. Ne se débloque que via un cheat code.",
      requiresUnlock: true,
      logo: "/vodka.png",
      component: AbsoluteSnake,
    },
  ];

  const availableModes = () =>
    gameModes.filter((m) => !m.requiresUnlock || absoluteUnlocked());

  const selectedMode = () =>
    gameModes.find((m) => m.id === selectedModeId()) || null;

  // Gestion de l'inactivité pour afficher le champ "cheat code :"
  onMount(() => {
    let lastActivity = Date.now();

    const resetActivity = () => {
      lastActivity = Date.now();
    };

    window.addEventListener("mousemove", resetActivity);
    window.addEventListener("keydown", resetActivity);
    window.addEventListener("click", resetActivity);
    window.addEventListener("touchstart", resetActivity);

    const inactivityInterval = setInterval(() => {
      if (!showCheatInput() && Date.now() - lastActivity > 300000) {
        setShowCheatInput(true);
      }
    }, 1000);

    onCleanup(() => {
      clearInterval(inactivityInterval);
      window.removeEventListener("mousemove", resetActivity);
      window.removeEventListener("keydown", resetActivity);
      window.removeEventListener("click", resetActivity);
      window.removeEventListener("touchstart", resetActivity);
    });
  });

  const handleCheatSubmit = (e) => {
    e.preventDefault();
    const value = cheatInput().trim();

    if (value === "/help") {
      setCheatMessage(
        "Question : Quel est le système gouvernemental où le chef de l'État à tous les pouvoirs ?"
      );
      setCheatInput("/");
    } else if (value === "/absolutisme") {
      setAbsoluteUnlocked(true);
      setCheatMessage("Absolut Snake débloqué ! Le mode est maintenant disponible.");
      setCheatInput("");
    } else if (value !== "") {
      setCheatMessage("Code invalide. Essaie /help si tu es perdu.");
    }
  };

  const goBackToModes = () => {
    setSelectedModeId(null);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        "justify-content": "center",
        "align-items": "center",
        "font-family":
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <Show
        when={selectedMode()}
        fallback={
          // --------- ÉCRAN DE SÉLECTION DES MODES ---------
          <div
            style={{
              width: "100%",
              "max-width": "800px",
              padding: "24px",
              "border-radius": "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                "justify-content": "space-between",
                "align-items": "center",
                "margin-bottom": "16px",
              }}
            >
              <div>
                <h2
                  style={{
                    "font-size": "22px",
                    "font-weight": "700",
                    margin: 0,
                  }}
                >
                  Sélection du mode de jeu
                </h2>
                <p
                  style={{
                    "font-size": "13px",
                    margin: "6px 0 0 0",
                  }}
                >
                  Choisis ton mode. Certains modes peuvent être cachés...
                </p>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                "grid-template-columns":
                  "repeat(auto-fit,minmax(220px,1fr))",
                gap: "16px",
              }}
            >
              {availableModes().map((mode) => (
                <button
                  type="button"
                  onClick={() => setSelectedModeId(mode.id)}
                  style={{
                    "text-align": "left",
                    padding: "16px",
                    "border-radius": "16px",
                    "box-shadow": "0 10px 25px rgba(0,0,0,0.4)",
                    cursor: "pointer",
                  }}
                  class="bg-base-100"
                >
                  <div
                    style={{
                      display: "flex",
                      "align-items": "center",
                      gap: "10px",
                      "margin-bottom": "6px",
                    }}
                  >
                    {mode.logo && (
                      <img
                        src={mode.logo}
                        alt={`Logo ${mode.label}`}
                        style={{
                          width: "100px",
                          height: "100px",
                          "object-fit": "contain",
                        }}
                      />
                    )}
                    <div
                      style={{
                        "font-size": "16px",
                        "font-weight": "600",
                      }}
                    >
                      {mode.label}
                    </div>
                  </div>

                  <div
                    style={{
                      "font-size": "13px",
                      "margin-bottom": "10px",
                    }}
                  >
                    {mode.description}
                  </div>
                  <div
                    style={{
                      "font-size": "11px",
                      "text-transform": "uppercase",
                      "letter-spacing": "0.06em",
                    }}
                    class="text-primary"
                  >
                    Jouer →
                  </div>
                </button>
              ))}
            </div>

            {/* Cheat code qui apparaît après 30s d'inactivité */}
            <Show when={showCheatInput()}>
              <div
                style={{
                  "margin-top": "20px",
                  padding: "12px 16px",
                  "border-radius": "12px",
                }}
                class="bg-base-100"
              >
                <form
                  onSubmit={handleCheatSubmit}
                  style={{
                    display: "flex",
                    "align-items": "center",
                    gap: "8px",
                    "flex-wrap": "wrap",
                  }}
                >
                  <label
                    for="cheat-code"
                    style={{
                      "font-size": "13px",
                      color: "#9ca3af",
                    }}
                  >
                    cheat code :
                  </label>
                  <input
                    id="cheat-code"
                    value={cheatInput()}
                    onInput={(e) =>
                      setCheatInput(e.currentTarget.value)
                    }
                    placeholder='Tape "/help" pour un indice'
                    style={{
                      flex: 1,
                      "min-width": "180px",
                      padding: "6px 10px",
                      "border-radius": "999px",
                      border: "1px solid #4b5563",
                      "background-color": "#020617",
                      color: "#e5e7eb",
                      "font-size": "13px",
                      outline: "none",
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: "6px 12px",
                      "border-radius": "999px",
                      border: "none",
                      "background-image":
                        "linear-gradient(135deg,#22c55e,#16a34a,#22c55e)",
                      color: "#020617",
                      cursor: "pointer",
                      "font-size": "12px",
                      "font-weight": "600",
                    }}
                  >
                    OK
                  </button>
                </form>
                <Show when={cheatMessage()}>
                  <div
                    style={{
                      "margin-top": "6px",
                      "font-size": "12px",
                    }}
                  >
                    {cheatMessage()}
                  </div>
                </Show>
              </div>
            </Show>
          </div>
        }
      >
        {/* --------- JEU SÉLECTIONNÉ --------- */}
        <div
          style={{
            display: "flex",
            "flex-direction": "column",
            gap: "8px",
            "align-items": "center",
            width: "100%",
            "max-width": "900px",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              "justify-content": "space-between",
              "align-items": "center",
              "margin-bottom": "8px",
              padding: "0 8px",
            }}
          >
            <div
              style={{
                display: "flex",
                "align-items": "center",
                gap: "10px",
              }}
            >
              {selectedMode()?.logo && (
                <img
                  src={selectedMode()?.logo}
                  alt={`Logo ${selectedMode()?.label}`}
                  style={{
                    width: "40px",
                    height: "40px",
                    "object-fit": "contain",
                  }}
                />
              )}
              <div>
                <div
                  style={{
                    "font-size": "18px",
                    "font-weight": "600",
                  }}
                >
                  {selectedMode()?.label}
                </div>
                <div
                  style={{
                    "font-size": "12px",
                    "max-width": "520px",
                  }}
                >
                  {selectedMode()?.description}
                </div>
              </div>
            </div>

            <button
              onClick={goBackToModes}
              style={{
                padding: "6px 12px",
                "border-radius": "999px",
                border: "1px solid #334155",
                cursor: "pointer",
                "font-size": "12px",
                "white-space": "nowrap",
              }}
            >
              ← Changer de mode
            </button>
          </div>

          <Dynamic component={selectedMode()?.component || ClassicSnake} />
        </div>
      </Show>
    </div>
  );
}

// ======================================================
// VERSION ABSOLUTE (adulte cachée) – avec compte à rebours
// ======================================================

function AbsoluteSnake() {
  const INITIAL_SEGMENTS = 10;
  const SEGMENT_LENGTH = 12;
  const SEGMENTS_PER_BOTTLE = 4;
  const MAX_SEGMENTS = 140;

  const BASE_AMPLITUDE = 10;
  const MAX_EXTRA_AMPLITUDE = 20;
  const WAVE_FREQUENCY = 0.6;
  const WAVE_SPEED = 4;

  const BASE_SPEED = 180;
  const HEAD_RADIUS = 8;
  const TURN_SPEED = 3.5;

  const BOTTLE_WIDTH = 18;
  const BOTTLE_HEIGHT = 40;

  const BARREL_WIDTH = 26;
  const BARREL_HEIGHT = 36;
  const BARREL_SPAWN_INTERVAL = 30;

  const WIN_SCORE = 25;

  let canvasRef;

  onMount(() => {
    const canvas = canvasRef;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bottleImg = new Image();
    let bottleImgLoaded = false;
    bottleImg.onload = () => {
      bottleImgLoaded = true;
    };
    bottleImg.src = "/vodka.png";

    const barrelImg = new Image();
    let barrelImgLoaded = false;
    barrelImg.onload = () => {
      barrelImgLoaded = true;
    };
    barrelImg.src = "/barrel.png";

    const maxAmplitude = BASE_AMPLITUDE + MAX_EXTRA_AMPLITUDE;

    let headX = WIDTH / 2;
    let headY = HEIGHT / 2;
    let angle = 0;
    let speed = BASE_SPEED;
    let phase = 0;
    let lastTime = 0;
    let animationId = 0;

    let path = [];
    let pathLength = 0;

    let segmentCount = INITIAL_SEGMENTS;
    let segmentPositions = [];

    let bottleX = 0;
    let bottleY = 0;

    let barrelX = 0;
    let barrelY = 0;
    let barrelActive = false;
    let barrelTimer = 0;

    let score = 0;
    let gameOver = false;
    let gameWon = false;

    let leftPressed = false;
    let rightPressed = false;
    let accelPressed = false;
    let brakePressed = false;

    let countdown = 3; // compte à rebours en secondes

    const spawnBottle = () => {
      const margin = HEAD_RADIUS + maxAmplitude + 40;
      bottleX = Math.random() * (WIDTH - margin * 2) + margin;
      bottleY = Math.random() * (HEIGHT - margin * 2) + margin;
    };

    const spawnBarrel = () => {
      const margin = HEAD_RADIUS + maxAmplitude + 40;
      barrelX = Math.random() * (WIDTH - margin * 2) + margin;
      barrelY = Math.random() * (HEIGHT - margin * 2) + margin;
      barrelActive = true;
    };

    const getPointAndDirAtDistance = (dist) => {
      if (path.length === 0) {
        return {
          x: headX,
          y: headY,
          dirX: Math.cos(angle),
          dirY: Math.sin(angle),
        };
      }

      if (dist <= 0 || path.length === 1) {
        const a = path[0];
        let dirX = Math.cos(angle);
        let dirY = Math.sin(angle);

        if (path.length > 1) {
          const b = path[1];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const len = Math.hypot(dx, dy) || 1;
          dirX = dx / len;
          dirY = dy / len;
        }

        return { x: a.x, y: a.y, dirX, dirY };
      }

      let remaining = dist;

      for (let i = 0; i < path.length - 1; i++) {
        const a = path[i];
        const b = path[i + 1];
        const segDx = b.x - a.x;
        const segDy = b.y - a.y;
        const segLen = Math.hypot(segDx, segDy);

        if (segLen >= remaining && segLen > 0) {
          const t = remaining / segLen;
          const x = a.x + segDx * t;
          const y = a.y + segDy * t;
          const dirX = (a.x - b.x) / segLen;
          const dirY = (a.y - b.y) / segLen;
          return { x, y, dirX, dirY };
        } else {
          remaining -= segLen;
        }
      }

      const lastIdx = path.length - 1;
      const last = path[lastIdx];
      const before = path[lastIdx - 1] || last;
      const dx = before.x - last.x;
      const dy = before.y - last.y;
      const len = Math.hypot(dx, dy) || 1;
      return {
        x: last.x,
        y: last.y,
        dirX: dx / len,
        dirY: dy / len,
      };
    };

    const rebuildSegmentPositions = () => {
      const absoluteRatio = Math.min(score / WIN_SCORE, 1);
      const currentAmplitude =
        BASE_AMPLITUDE + MAX_EXTRA_AMPLITUDE * absoluteRatio;

      segmentPositions = [];
      for (let i = 0; i < segmentCount; i++) {
        const dist = i * SEGMENT_LENGTH;
        const p = getPointAndDirAtDistance(dist);
        const normalX = -p.dirY;
        const normalY = p.dirX;
        const offset =
          currentAmplitude * Math.sin(i * WAVE_FREQUENCY + phase);

        const x = p.x + normalX * offset;
        const y = p.y + normalY * offset;

        segmentPositions.push({
          x,
          y,
          dirX: p.dirX,
          dirY: p.dirY,
        });
      }
    };

    const checkWin = () => {
      if (score >= WIN_SCORE) {
        gameOver = true;
        gameWon = true;
      }
    };

    const resetGame = () => {
      headX = WIDTH / 2;
      headY = HEIGHT / 2;
      angle = 0;
      speed = BASE_SPEED;
      phase = 0;
      lastTime = 0;

      segmentCount = INITIAL_SEGMENTS;

      path = [];
      const dirX = Math.cos(angle);
      const dirY = Math.sin(angle);
      const extraTail = 10;
      for (let i = 0; i < segmentCount + extraTail; i++) {
        path.push({
          x: headX - dirX * i * SEGMENT_LENGTH,
          y: headY - dirY * i * SEGMENT_LENGTH,
        });
      }
      pathLength = (path.length - 1) * SEGMENT_LENGTH;

      segmentPositions = [];

      score = 0;
      gameOver = false;
      gameWon = false;

      leftPressed = false;
      rightPressed = false;
      accelPressed = false;
      brakePressed = false;

      barrelActive = false;
      barrelTimer = 0;

      countdown = 3;

      spawnBottle();
    };

    resetGame();

    const handleCollisions = () => {
      if (segmentPositions.length === 0) return;

      const headPos = segmentPositions[0];

      if (
        headPos.x < HEAD_RADIUS ||
        headPos.x > WIDTH - HEAD_RADIUS ||
        headPos.y < HEAD_RADIUS ||
        headPos.y > HEIGHT - HEAD_RADIUS
      ) {
        gameOver = true;
        gameWon = false;
        return;
      }

      const SELF_COLLISION_START = 10;
      for (let i = SELF_COLLISION_START; i < segmentPositions.length; i++) {
        const p = segmentPositions[i];
        const dx = headPos.x - p.x;
        const dy = headPos.y - p.y;
        const d = Math.hypot(dx, dy);
        if (d < HEAD_RADIUS * 1.1) {
          gameOver = true;
          gameWon = false;
          return;
        }
      }

      {
        const dx = headPos.x - bottleX;
        const dy = headPos.y - bottleY;
        const dist = Math.hypot(dx, dy);
        const bottleRadius = BOTTLE_HEIGHT / 2;
        if (dist < HEAD_RADIUS + bottleRadius) {
          score += 1;
          segmentCount = Math.min(
            segmentCount + SEGMENTS_PER_BOTTLE,
            MAX_SEGMENTS
          );
          spawnBottle();
          checkWin();
        }
      }

      if (barrelActive) {
        const dx = headPos.x - barrelX;
        const dy = headPos.y - barrelY;
        const dist = Math.hypot(dx, dy);
        const barrelRadius = BARREL_HEIGHT / 2;
        if (dist < HEAD_RADIUS + barrelRadius) {
          score += 2;
          segmentCount = Math.min(
            segmentCount + SEGMENTS_PER_BOTTLE * 2,
            MAX_SEGMENTS
          );
          barrelActive = false;
          checkWin();
        }
      }
    };

    const drawBottle = (ctx) => {
      ctx.save();
      ctx.translate(bottleX, bottleY);

      if (!bottleImgLoaded) {
        ctx.fillStyle = "#e5e7eb";
        ctx.fillRect(
          -BOTTLE_WIDTH / 2,
          -BOTTLE_HEIGHT / 2,
          BOTTLE_WIDTH,
          BOTTLE_HEIGHT
        );
        ctx.restore();
        return;
      }

      const drawHeight = 40;
      const drawWidth = 36; // ta valeur

      ctx.drawImage(
        bottleImg,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
      );

      ctx.restore();
    };

    const drawBarrel = (ctx) => {
      if (!barrelActive) return;

      ctx.save();
      ctx.translate(barrelX, barrelY);

      if (!barrelImgLoaded) {
        ctx.fillStyle = "#92400e";
        ctx.fillRect(
          -BARREL_WIDTH / 2,
          -BARREL_HEIGHT / 2,
          BARREL_WIDTH,
          BARREL_HEIGHT
        );
        ctx.restore();
        return;
      }

      const drawHeight = 60;
      const drawWidth = 50; // ta valeur

      ctx.drawImage(
        barrelImg,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
      );

      ctx.restore();
    };

    const handleKeyDown = (e) => {
      if (gameOver && (e.key === "r" || e.key === "R")) {
        resetGame();
        return;
      }

      if (gameOver) return;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      switch (e.key) {
        case "ArrowLeft":
          leftPressed = true;
          break;
        case "ArrowRight":
          rightPressed = true;
          break;
        case "ArrowUp":
          accelPressed = true;
          break;
        case "ArrowDown":
          brakePressed = true;
          break;
      }
    };

    const handleKeyUp = (e) => {
      if (gameOver) return;

      switch (e.key) {
        case "ArrowLeft":
          leftPressed = false;
          break;
        case "ArrowRight":
          rightPressed = false;
          break;
        case "ArrowUp":
          accelPressed = false;
          break;
        case "ArrowDown":
          brakePressed = false;
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const update = (dt) => {
      if (gameOver) return;

      // compte à rebours
      if (countdown > 0) {
        countdown -= dt;
        if (countdown < 0) countdown = 0;
        return;
      }

      if (leftPressed && !rightPressed) {
        angle -= TURN_SPEED * dt;
      } else if (rightPressed && !leftPressed) {
        angle += TURN_SPEED * dt;
      }

      if (accelPressed && !brakePressed) {
        speed = BASE_SPEED * 1.4;
      } else if (brakePressed && !accelPressed) {
        speed = BASE_SPEED * 0.6;
      } else {
        speed = BASE_SPEED;
      }

      const prevHeadX = headX;
      const prevHeadY = headY;

      headX += Math.cos(angle) * speed * dt;
      headY += Math.sin(angle) * speed * dt;

      const moveDx = headX - prevHeadX;
      const moveDy = headY - prevHeadY;
      const movedDist = Math.hypot(moveDx, moveDy);

      if (movedDist > 0) {
        path.unshift({ x: headX, y: headY });
        pathLength += movedDist;
      }

      const maxPathLength = segmentCount * SEGMENT_LENGTH + 200;
      while (pathLength > maxPathLength && path.length > 1) {
        const last = path[path.length - 1];
        const before = path[path.length - 2];
        const segLen = Math.hypot(last.x - before.x, last.y - before.y);
        path.pop();
        pathLength -= segLen;
      }

      phase += WAVE_SPEED * dt;

      barrelTimer += dt;
      if (!barrelActive && barrelTimer >= BARREL_SPAWN_INTERVAL) {
        spawnBarrel();
        barrelTimer = 0;
      }

      rebuildSegmentPositions();
      handleCollisions();
    };

    const draw = (ctx) => {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      ctx.fillStyle = "#e5e7eb";
      ctx.font = "16px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`Score : ${score} / ${WIN_SCORE}`, 16, 24);
      ctx.fillText("Bouteille = 1 pt | Baril = 2 pts", 16, 44);

      drawBottle(ctx);
      drawBarrel(ctx);

      if (segmentPositions.length > 0) {
        ctx.lineWidth = HEAD_RADIUS * 2;
        ctx.lineCap = "round";

        const absoluteRatio = Math.min(score / WIN_SCORE, 1);
        const bodyR = Math.round(34 + (239 - 34) * absoluteRatio);
        const bodyG = Math.round(197 + (68 - 197) * absoluteRatio);
        const bodyB = Math.round(94 + (68 - 94) * absoluteRatio);
        ctx.strokeStyle = `rgb(${bodyR},${bodyG},${bodyB})`;

        ctx.beginPath();
        const first = segmentPositions[0];
        ctx.moveTo(first.x, first.y);
        for (let i = 1; i < segmentPositions.length; i++) {
          const p = segmentPositions[i];
          ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();

        const headSeg = segmentPositions[0];

        let dirX = headSeg.dirX;
        let dirY = headSeg.dirY;
        const len = Math.hypot(dirX, dirY) || 1;
        dirX /= len;
        dirY /= len;

        const headRadiusDraw = HEAD_RADIUS * 1.2;

        const r = Math.round(34 + (239 - 34) * absoluteRatio);
        const g = Math.round(197 + (68 - 197) * absoluteRatio);
        const b = Math.round(94 + (68 - 94) * absoluteRatio);
        const headColor = `rgb(${r},${g},${b})`;

        ctx.beginPath();
        ctx.arc(headSeg.x, headSeg.y, headRadiusDraw, 0, Math.PI * 2);
        ctx.fillStyle = headColor;
        ctx.fill();

        const normalX = -dirY;
        const normalY = dirX;

        const eyeOffsetForward = headRadiusDraw * 0.5;
        const eyeOffsetSide = headRadiusDraw * 0.5;

        const eye1X =
          headSeg.x +
          dirX * eyeOffsetForward +
          normalX * -eyeOffsetSide;
        const eye1Y =
          headSeg.y +
          dirY * eyeOffsetForward +
          normalY * -eyeOffsetSide;

        const eye2X =
          headSeg.x +
          dirX * eyeOffsetForward +
          normalX * eyeOffsetSide;
        const eye2Y =
          headSeg.y +
          dirY * eyeOffsetForward +
          normalY * eyeOffsetSide;

        ctx.beginPath();
        ctx.fillStyle = "#0f172a";
        ctx.arc(eye1X, eye1Y, 2, 0, Math.PI * 2);
        ctx.arc(eye2X, eye2Y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // overlay compte à rebours
      if (countdown > 0 && !gameOver) {
        ctx.fillStyle = "rgba(15,23,42,0.7)";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = "#f9fafb";
        ctx.textAlign = "center";
        ctx.font =
          "bold 40px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.fillText(
          Math.ceil(countdown).toString(),
          WIDTH / 2,
          HEIGHT / 2
        );
      }

      if (gameOver) {
        ctx.fillStyle = "rgba(15,23,42,0.7)";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        ctx.fillStyle = "#f9fafb";
        ctx.textAlign = "center";

        if (gameWon) {
          ctx.font =
            "bold 32px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
          ctx.fillText("VICTOIRE !", WIDTH / 2, HEIGHT / 2 - 10);
        } else {
          ctx.font =
            "bold 32px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
          ctx.fillText("GAME OVER", WIDTH / 2, HEIGHT / 2 - 10);
        }

        ctx.font =
          "16px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.fillText(
          "Appuie sur R pour recommencer",
          WIDTH / 2,
          HEIGHT / 2 + 20
        );
      }
    };

    const loop = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      const dt = (timestamp - lastTime) / 1000;
      lastTime = timestamp;

      update(dt);
      draw(ctx);

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    onCleanup(() => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    });
  });

  return (
    <div
      style={{
        display: "flex",
        "justify-content": "center",
        "align-items": "center",
      }}
    >
      <canvas
        ref={(el) => (canvasRef = el)}
        width={WIDTH}
        height={HEIGHT}
        style={{
          border: "2px solid #1f2937",
          "border-radius": "16px",
          "box-shadow": "0 20px 40px rgba(0,0,0,0.5)",
          "background-color": "black",
        }}
      />
    </div>
  );
}

// ======================================================
// VERSION CLASSIQUE – linux.png + ennemis + countdown
// ======================================================

function ClassicSnake() {
  const CELL = 40; // 40 si tu veux 2x moins de cases, sinon 20
  const COLS = Math.floor(WIDTH / CELL);
  const ROWS = Math.floor(HEIGHT / CELL);

  const STEP_TIME = 0.12;
  const ENEMY_INTERVAL = 30;

  let canvasRef;

  onMount(() => {
    const canvas = canvasRef;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // sprites
    const linuxImg = new Image();
    linuxImg.src = "/linux.png";
    let linuxLoaded = false;
    linuxImg.onload = () => (linuxLoaded = true);

    const appleImg = new Image();
    appleImg.src = "/apple.png";
    let appleLoaded = false;
    appleImg.onload = () => (appleLoaded = true);

    const windowImg = new Image();
    windowImg.src = "/window.png";
    let windowLoaded = false;
    windowImg.onload = () => (windowLoaded = true);

    let snake = [];
    let dir = { x: 1, y: 0 };
    let nextDir = { x: 1, y: 0 };

    let food = { x: 5, y: 5 };

    let enemy = { x: 10, y: 10 };
    let enemyActive = false;
    let enemyTimer = 0;
    let enemyIndex = 0; // 0 = Apple, 1 = Windows

    let lastTime = 0;
    let accumulator = 0;
    let animationId = 0;

    let gameOver = false;
    let gameWon = false;

    let countdown = 3;

    const totalCells = COLS * ROWS;

    const reset = () => {
      const startX = Math.floor(COLS / 2);
      const startY = Math.floor(ROWS / 2);
      snake = [
        { x: startX, y: startY },
        { x: startX - 1, y: startY },
        { x: startX - 2, y: startY },
      ];
      dir = { x: 1, y: 0 };
      nextDir = { x: 1, y: 0 };
      gameOver = false;
      gameWon = false;

      enemyActive = false;
      enemyTimer = 0;
      enemyIndex = 0;

      countdown = 3;

      spawnFood();
    };

    const isOnSnake = (x, y) =>
      snake.some((s) => s.x === x && s.y === y);

    const spawnFood = () => {
      let fx, fy;
      do {
        fx = Math.floor(Math.random() * COLS);
        fy = Math.floor(Math.random() * ROWS);
      } while (isOnSnake(fx, fy));
      food = { x: fx, y: fy };
    };

    const spawnEnemy = () => {
      let ex, ey;
      do {
        ex = Math.floor(Math.random() * COLS);
        ey = Math.floor(Math.random() * ROWS);
      } while (
        isOnSnake(ex, ey) ||
        (ex === food.x && ey === food.y)
      );
      enemy = { x: ex, y: ey };
      enemyActive = true;
      enemyIndex = (enemyIndex + 1) % 2;
    };

    const handleKeyDown = (e) => {
      if (gameOver && (e.key === "r" || e.key === "R")) {
        reset();
        return;
      }

      if (gameOver) return;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "z":
          if (dir.y !== 1) nextDir = { x: 0, y: -1 };
          break;
        case "ArrowDown":
        case "s":
          if (dir.y !== -1) nextDir = { x: 0, y: 1 };
          break;
        case "ArrowLeft":
        case "a":
          if (dir.x !== 1) nextDir = { x: -1, y: 0 };
          break;
        case "ArrowRight":
        case "d":
          if (dir.x !== -1) nextDir = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    const update = (dt) => {
      if (gameOver) return;

      // countdown
      if (countdown > 0) {
        countdown -= dt;
        if (countdown < 0) countdown = 0;
        return;
      }

      accumulator += dt;
      enemyTimer += dt;

      if (enemyTimer >= ENEMY_INTERVAL) {
        spawnEnemy();
        enemyTimer = 0;
      }

      if (accumulator < STEP_TIME) return;
      accumulator -= STEP_TIME;

      dir = nextDir;

      const head = snake[0];
      const newHead = { x: head.x + dir.x, y: head.y + dir.y };

      if (
        newHead.x < 0 ||
        newHead.x >= COLS ||
        newHead.y < 0 ||
        newHead.y >= ROWS
      ) {
        gameOver = true;
        return;
      }

      if (snake.some((s) => s.x === newHead.x && s.y === newHead.y)) {
        gameOver = true;
        return;
      }

      snake.unshift(newHead);

      let grew = false;

      // Linux = +1
      if (newHead.x === food.x && newHead.y === food.y) {
        grew = true;
        spawnFood();
      }

      // Ennemi = -2
      if (enemyActive && newHead.x === enemy.x && newHead.y === enemy.y) {
        enemyActive = false;
        enemyTimer = 0;
        const toRemove = 2;
        for (let i = 0; i < toRemove && snake.length > 1; i++) {
          snake.pop();
        }
      }

      if (!grew) {
        snake.pop();
      }

      if (snake.length >= totalCells) {
        gameOver = true;
        gameWon = true;
      }
    };

    const draw = (ctx) => {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      ctx.strokeStyle = "rgba(51,65,85,0.35)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= COLS; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CELL + 0.5, 0);
        ctx.lineTo(x * CELL + 0.5, ROWS * CELL);
        ctx.stroke();
      }
      for (let y = 0; y <= ROWS; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * CELL + 0.5);
        ctx.lineTo(COLS * CELL, y * CELL + 0.5);
        ctx.stroke();
      }

      ctx.fillStyle = "#e5e7eb";
      ctx.font = "14px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(
        `Longueur : ${snake.length} / ${totalCells}`,
        12,
        20
      );
      ctx.fillText(
        "Objectif : remplir le terrain avec ton corps",
        12,
        40
      );
      ctx.fillText(
        "Linux = +1  |  Apple / Windows = -2",
        12,
        60
      );

      // nourriture : linux
      if (linuxLoaded) {
        const size = CELL * 0.9;
        ctx.drawImage(
          linuxImg,
          food.x * CELL + (CELL - size) / 2,
          food.y * CELL + (CELL - size) / 2,
          size,
          size
        );
      } else {
        ctx.beginPath();
        ctx.fillStyle = "#22c55e";
        ctx.arc(
          food.x * CELL + CELL / 2,
          food.y * CELL + CELL / 2,
          CELL * 0.35,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      // ennemi
      if (enemyActive) {
        const size = CELL * 0.9;
        const useApple = enemyIndex === 1;
        const img = useApple ? appleImg : windowImg;
        const loaded = useApple ? appleLoaded : windowLoaded;

        if (loaded) {
          ctx.drawImage(
            img,
            enemy.x * CELL + (CELL - size) / 2,
            enemy.y * CELL + (CELL - size) / 2,
            size,
            size
          );
        } else {
          ctx.beginPath();
          ctx.fillStyle = "#ef4444";
          ctx.arc(
            enemy.x * CELL + CELL / 2,
            enemy.y * CELL + CELL / 2,
            CELL * 0.35,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }

      // snake dégradé de vert
      for (let i = snake.length - 1; i >= 0; i--) {
        const s = snake[i];
        const t =
          snake.length <= 1 ? 0 : i / (snake.length - 1);

        const start = { r: 187, g: 247, b: 208 };
        const end = { r: 22, g: 101, b: 52 };

        const r = Math.round(start.r + (end.r - start.r) * t);
        const g = Math.round(start.g + (end.g - start.g) * t);
        const b = Math.round(start.b + (end.b - start.b) * t);

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(
          s.x * CELL + 2,
          s.y * CELL + 2,
          CELL - 4,
          CELL - 4
        );
      }

      const head = snake[0];
      ctx.fillStyle = "#facc15";
      ctx.fillRect(
        head.x * CELL + 3,
        head.y * CELL + 3,
        CELL - 6,
        CELL - 6
      );

      // overlay countdown
      if (countdown > 0 && !gameOver) {
        ctx.fillStyle = "rgba(15,23,42,0.75)";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = "#f9fafb";
        ctx.textAlign = "center";
        ctx.font =
          "bold 40px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.fillText(
          Math.ceil(countdown).toString(),
          WIDTH / 2,
          HEIGHT / 2
        );
      }

      if (gameOver) {
        ctx.fillStyle = "rgba(15,23,42,0.75)";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = "#f9fafb";
        ctx.textAlign = "center";
        ctx.font = "bold 28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.fillText(
          gameWon ? "VICTOIRE !" : "GAME OVER",
          WIDTH / 2,
          HEIGHT / 2 - 10
        );
        ctx.font =
          "16px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.fillText(
          "Appuie sur R pour recommencer",
          WIDTH / 2,
          HEIGHT / 2 + 20
        );
      }
    };

    const loop = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      const dt = (timestamp - lastTime) / 1000;
      lastTime = timestamp;

      update(dt);
      draw(ctx);

      animationId = requestAnimationFrame(loop);
    };

    reset();
    animationId = requestAnimationFrame(loop);

    onCleanup(() => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("keydown", handleKeyDown);
    });
  });

  return (
    <div
      style={{
        display: "flex",
        "justify-content": "center",
        "align-items": "center",
      }}
    >
      <canvas
        ref={(el) => (canvasRef = el)}
        width={WIDTH}
        height={HEIGHT}
        style={{
          border: "2px solid #1f2937",
          "border-radius": "16px",
          "box-shadow": "0 20px 40px rgba(0,0,0,0.5)",
          "background-color": "black",
        }}
      />
    </div>
  );
}

// ======================================================
// MODE OBSTACLES – obstacles + linux + ennemis + countdown
// ======================================================

function ObstaclesSnake() {
  const CELL = 40; // même densité que le classique
  const COLS = Math.floor(WIDTH / CELL);
  const ROWS = Math.floor(HEIGHT / CELL);

  const STEP_TIME = 0.12;
  const ENEMY_INTERVAL = 30;

  let canvasRef;

  onMount(() => {
    const canvas = canvasRef;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // sprites
    const linuxImg = new Image();
    linuxImg.src = "/linux.png";
    let linuxLoaded = false;
    linuxImg.onload = () => (linuxLoaded = true);

    const appleImg = new Image();
    appleImg.src = "/apple.png";
    let appleLoaded = false;
    appleImg.onload = () => (appleLoaded = true);

    const windowImg = new Image();
    windowImg.src = "/window.png";
    let windowLoaded = false;
    windowImg.onload = () => (windowLoaded = true);

    let snake = [];
    let dir = { x: 1, y: 0 };
    let nextDir = { x: 1, y: 0 };

    let apple = { x: 5, y: 5 };

    let enemy = { x: 10, y: 10 };
    let enemyActive = false;
    let enemyTimer = 0;
    let enemyIndex = 0;

    let lastTime = 0;
    let accumulator = 0;
    let animationId = 0;

    let gameOver = false;
    let gameWon = false;

    let countdown = 3;

    // zone de départ
    const startX0 = Math.floor(COLS / 4);
    const startY0 = Math.floor(ROWS / 2);

    const obstacles = [];
    const obstacleSet = new Set();
    const OBSTACLE_MIN = 6;
    const OBSTACLE_MAX = 18;

    const key = (x, y) => `${x},${y}`;
    const isInside = (x, y) =>
      x >= 0 && x < COLS && y >= 0 && y < ROWS;

    const isObstacle = (x, y) => obstacleSet.has(key(x, y));

    const rebuildObstacleSet = () => {
      obstacleSet.clear();
      for (const o of obstacles) {
        obstacleSet.add(key(o.x, o.y));
      }
    };

    const boardIsValid = () => {
      const dirs = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
      ];

      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          if (isObstacle(x, y)) continue;

          let freeNeighbours = 0;
          for (const d of dirs) {
            const nx = x + d.x;
            const ny = y + d.y;
            if (!isInside(nx, ny)) continue;
            if (!isObstacle(nx, ny)) {
              freeNeighbours++;
              if (freeNeighbours >= 2) break;
            }
          }
          if (freeNeighbours < 2) {
            return false;
          }
        }
      }
      return true;
    };

    const generateObstacles = () => {
      const maxAttempts = 40;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        obstacles.length = 0;
        obstacleSet.clear();

        const count =
          OBSTACLE_MIN +
          Math.floor(
            Math.random() * (OBSTACLE_MAX - OBSTACLE_MIN + 1)
          );

        while (obstacles.length < count) {
          const type = Math.random() < 0.5 ? "single" : "cross";

          if (type === "single") {
            const x = Math.floor(Math.random() * COLS);
            const y = Math.floor(Math.random() * ROWS);

            if (isObstacle(x, y)) continue;

            if (
              Math.abs(x - startX0) <= 2 &&
              Math.abs(y - startY0) <= 2
            ) {
              continue;
            }

            obstacles.push({ x, y });
            obstacleSet.add(key(x, y));
          } else {
            const cx = Math.floor(Math.random() * COLS);
            const cy = Math.floor(Math.random() * ROWS);

            const cells = [
              { x: cx, y: cy },
              { x: cx + 1, y: cy },
              { x: cx - 1, y: cy },
              { x: cx, y: cy + 1 },
              { x: cx, y: cy - 1 },
            ];

            if (cells.some((c) => !isInside(c.x, c.y))) continue;

            if (
              cells.some(
                (c) =>
                  Math.abs(c.x - startX0) <= 2 &&
                  Math.abs(c.y - startY0) <= 2
              )
            ) {
              continue;
            }

            if (
              cells.some((c) => obstacleSet.has(key(c.x, c.y)))
            )
              continue;

            for (const c of cells) {
              obstacles.push({ x: c.x, y: c.y });
              obstacleSet.add(key(c.x, c.y));
            }
          }
        }

        if (boardIsValid()) {
          rebuildObstacleSet();
          return;
        }
      }

      obstacles.length = 0;
      obstacleSet.clear();
    };

    let totalCells = COLS * ROWS;

    const isOnSnake = (x, y) =>
      snake.some((s) => s.x === x && s.y === y);

    const spawnFruit = () => {
      let ax, ay;
      do {
        ax = Math.floor(Math.random() * COLS);
        ay = Math.floor(Math.random() * ROWS);
      } while (isOnSnake(ax, ay) || isObstacle(ax, ay));
      apple = { x: ax, y: ay };
    };

    const spawnEnemy = () => {
      let ex, ey;
      do {
        ex = Math.floor(Math.random() * COLS);
        ey = Math.floor(Math.random() * ROWS);
      } while (
        isOnSnake(ex, ey) ||
        isObstacle(ex, ey) ||
        (ex === apple.x && ey === apple.y)
      );

      enemy = { x: ex, y: ey };
      enemyActive = true;
      enemyIndex = (enemyIndex + 1) % 2;
    };

    const reset = () => {
      snake = [
        { x: startX0, y: startY0 },
        { x: startX0 - 1, y: startY0 },
        { x: startX0 - 2, y: startY0 },
      ];
      dir = { x: 1, y: 0 };
      nextDir = { x: 1, y: 0 };
      gameOver = false;
      gameWon = false;

      generateObstacles();
      totalCells = COLS * ROWS - obstacles.length;

      enemyActive = false;
      enemyTimer = 0;
      enemyIndex = 0;

      countdown = 3;

      spawnFruit();
    };

    const handleKeyDown = (e) => {
      if (gameOver && (e.key === "r" || e.key === "R")) {
        reset();
        return;
      }

      if (gameOver) return;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "z":
          if (dir.y !== 1) nextDir = { x: 0, y: -1 };
          break;
        case "ArrowDown":
        case "s":
          if (dir.y !== -1) nextDir = { x: 0, y: 1 };
          break;
        case "ArrowLeft":
        case "a":
          if (dir.x !== 1) nextDir = { x: -1, y: 0 };
          break;
        case "ArrowRight":
        case "d":
          if (dir.x !== -1) nextDir = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    const update = (dt) => {
      if (gameOver) return;

      // countdown
      if (countdown > 0) {
        countdown -= dt;
        if (countdown < 0) countdown = 0;
        return;
      }

      accumulator += dt;
      enemyTimer += dt;

      if (enemyTimer >= ENEMY_INTERVAL) {
        spawnEnemy();
        enemyTimer = 0;
      }

      if (accumulator < STEP_TIME) return;
      accumulator -= STEP_TIME;

      dir = nextDir;

      const head = snake[0];
      const newHead = { x: head.x + dir.x, y: head.y + dir.y };

      if (
        newHead.x < 0 ||
        newHead.x >= COLS ||
        newHead.y < 0 ||
        newHead.y >= ROWS
      ) {
        gameOver = true;
        return;
      }

      if (isObstacle(newHead.x, newHead.y)) {
        gameOver = true;
        return;
      }

      if (snake.some((s) => s.x === newHead.x && s.y === newHead.y)) {
        gameOver = true;
        return;
      }

      snake.unshift(newHead);

      let grew = false;

      // Linux
      if (newHead.x === apple.x && newHead.y === apple.y) {
        grew = true;
        spawnFruit();
      }

      // Ennemi
      if (enemyActive && newHead.x === enemy.x && newHead.y === enemy.y) {
        enemyActive = false;
        enemyTimer = 0;
        const toRemove = 2;
        for (let i = 0; i < toRemove && snake.length > 1; i++) {
          snake.pop();
        }
      }

      if (!grew) {
        snake.pop();
      }

      if (snake.length >= totalCells) {
        gameOver = true;
        gameWon = true;
      }
    };

    const draw = (ctx) => {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      ctx.strokeStyle = "rgba(51,65,85,0.35)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= COLS; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CELL + 0.5, 0);
        ctx.lineTo(x * CELL + 0.5, ROWS * CELL);
        ctx.stroke();
      }
      for (let y = 0; y <= ROWS; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * CELL + 0.5);
        ctx.lineTo(COLS * CELL, y * CELL + 0.5);
        ctx.stroke();
      }

      ctx.fillStyle = "#e5e7eb";
      ctx.font = "14px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(
        `Longueur : ${snake.length} / ${totalCells}`,
        12,
        20
      );
      ctx.fillText(
        "Objectif : remplir l'espace en évitant les obstacles",
        12,
        40
      );
      ctx.fillText(
        "Linux = +1  |  Apple / Windows = -2",
        12,
        60
      );

      // obstacles
      ctx.fillStyle = "#111827";
      obstacles.forEach((o) => {
        ctx.fillRect(
          o.x * CELL + 1,
          o.y * CELL + 1,
          CELL - 2,
          CELL - 2
        );
      });

      // nourriture : linux
      if (linuxLoaded) {
        const size = CELL * 0.9;
        ctx.drawImage(
          linuxImg,
          apple.x * CELL + (CELL - size) / 2,
          apple.y * CELL + (CELL - size) / 2,
          size,
          size
        );
      } else {
        ctx.beginPath();
        ctx.fillStyle = "#22c55e";
        ctx.arc(
          apple.x * CELL + CELL / 2,
          apple.y * CELL + CELL / 2,
          CELL * 0.35,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      // ennemi
      if (enemyActive) {
        const size = CELL * 0.9;
        const useApple = enemyIndex === 1;
        const img = useApple ? appleImg : windowImg;
        const loaded = useApple ? appleLoaded : windowLoaded;

        if (loaded) {
          ctx.drawImage(
            img,
            enemy.x * CELL + (CELL - size) / 2,
            enemy.y * CELL + (CELL - size) / 2,
            size,
            size
          );
        } else {
          ctx.beginPath();
          ctx.fillStyle = "#ef4444";
          ctx.arc(
            enemy.x * CELL + CELL / 2,
            enemy.y * CELL + CELL / 2,
            CELL * 0.35,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }

      // snake dégradé de vert
      for (let i = snake.length - 1; i >= 0; i--) {
        const s = snake[i];
        const t =
          snake.length <= 1 ? 0 : i / (snake.length - 1);

        const start = { r: 187, g: 247, b: 208 };
        const end = { r: 22, g: 101, b: 52 };

        const r = Math.round(start.r + (end.r - start.r) * t);
        const g = Math.round(start.g + (end.g - start.g) * t);
        const b = Math.round(start.b + (end.b - start.b) * t);

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(
          s.x * CELL + 2,
          s.y * CELL + 2,
          CELL - 4,
          CELL - 4
        );
      }

      const head = snake[0];
      ctx.fillStyle = "#facc15";
      ctx.fillRect(
        head.x * CELL + 3,
        head.y * CELL + 3,
        CELL - 6,
        CELL - 6
      );

      // countdown
      if (countdown > 0 && !gameOver) {
        ctx.fillStyle = "rgba(15,23,42,0.75)";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = "#f9fafb";
        ctx.textAlign = "center";
        ctx.font =
          "bold 40px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.fillText(
          Math.ceil(countdown).toString(),
          WIDTH / 2,
          HEIGHT / 2
        );
      }

      if (gameOver) {
        ctx.fillStyle = "rgba(15,23,42,0.75)";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = "#f9fafb";
        ctx.textAlign = "center";
        ctx.font =
          "bold 28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.fillText(
          gameWon ? "VICTOIRE !" : "GAME OVER",
          WIDTH / 2,
          HEIGHT / 2 - 10
        );
        ctx.font =
          "16px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.fillText(
          "Appuie sur R pour recommencer",
          WIDTH / 2,
          HEIGHT / 2 + 20
        );
      }
    };

    const loop = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      const dt = (timestamp - lastTime) / 1000;
      lastTime = timestamp;

      update(dt);
      draw(ctx);

      animationId = requestAnimationFrame(loop);
    };

    reset();
    animationId = requestAnimationFrame(loop);

    onCleanup(() => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("keydown", handleKeyDown);
    });
  });

  return (
    <div
      style={{
        display: "flex",
        "justify-content": "center",
        "align-items": "center",
      }}
    >
      <canvas
        ref={(el) => (canvasRef = el)}
        width={WIDTH}
        height={HEIGHT}
        style={{
          border: "2px solid #1f2937",
          "border-radius": "16px",
          "box-shadow": "0 20px 40px rgba(0,0,0,0.5)",
          "background-color": "black",
        }}
      />
    </div>
  );
}

export default SnakeApp;
