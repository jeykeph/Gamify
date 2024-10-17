;; Decentralized Board Game Platform

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u100))
(define-constant ERR_GAME_NOT_FOUND (err u101))
(define-constant ERR_INVALID_MOVE (err u102))

;; Data Maps
(define-map games
  { game-id: uint }
  { game-type: (string-ascii 20),
    player1: principal,
    player2: principal,
    current-state: (string-ascii 100),
    current-turn: principal,
    winner: (optional principal) })

(define-map player-stats
  { player: principal }
  { games-played: uint,
    games-won: uint })

;; NFT for rewards
(define-non-fungible-token game-reward uint)

;; Functions

(define-public (create-game (game-type (string-ascii 20)) (opponent principal))
  (let ((game-id (+ (default-to u0 (get-last-game-id)) u1)))
    (map-set games
      { game-id: game-id }
      { game-type: game-type,
        player1: tx-sender,
        player2: opponent,
        current-state: "initial",
        current-turn: tx-sender,
        winner: none })
    (ok game-id)))

(define-read-only (get-game (game-id uint))
  (match (map-get? games { game-id: game-id })
    game (ok game)
    (err ERR_GAME_NOT_FOUND)))


(define-public (make-move (game-id uint) (move (string-ascii 20)))
  (let ((game (unwrap! (get-game game-id) ERR_GAME_NOT_FOUND)))
    (asserts! (is-eq (get current-turn game) tx-sender) ERR_NOT_AUTHORIZED)
    ;; Here, we would validate the move based on game rules
    ;; For simplicity, we're just updating the state
    (map-set games
      { game-id: game-id }
      (merge game
        { current-state: move,
          current-turn: (if (is-eq (get current-turn game) (get player1 game))
                            (get player2 game)
                            (get player1 game)) }))
    (ok true)))

