export interface Field {
    playerId: string | null,
    row: number,
    column: number,
    payload?:{
        x:number,
        y:number,
        sprite: Phaser.GameObjects.GameObject
    }
    
}