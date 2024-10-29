
export const translations = {
    "es": {
        title: "Tres en Raya",
        current_player_label: "Turno de:",
        restart_label: "REINICIAR",
        round_label: "ROUND",
        score_label: "PUNTAJE",
        footer_text: "Desarrollado con Phaser js por Gabriel Moreno",
        restart_modal_text: "DESEA REINICIAR?",
        point_text: "PUNTO PARA",
        round_over_text: "EMPATE",
        yes: "SI",
        no: "NO"
    } as translations,
    "en": {
        title: "Tic-Tac-Toe",
        current_player_label: "Turn of:",
        restart_label: "RESTART",
        round_label: "ROUND",
        score_label: "SCORE",
        footer_text: "Develoed with Phaser js by Gabriel Moreno",
        restart_modal_text: "DO YOU WANT TO RESTART?",
        point_text: "POINT FOR",
        round_over_text: "DRAW",
        no: "NO",
        yes: "YES"
    } as translations
}

export interface translations {
    title: string,
    score_label: string,
    restart_label: string,
    round_label: string,
    current_player_label: string,
    footer_text: string,
    restart_modal_text: string,
    point_text: string,
    round_over_text: string,
    yes: string,
    no: string
}