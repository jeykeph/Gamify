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

