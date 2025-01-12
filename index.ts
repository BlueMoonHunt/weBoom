class Vec2 {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

const gridLayout = new Vec2(10, 10);

function fillCircle(context: CanvasRenderingContext2D, center: Vec2, radius: number, fillStyle: CanvasFillStrokeStyles["fillStyle"]) {
    context.fillStyle = "magenta";
    context.beginPath();
    context.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    context.fill();
}

function strokeLine(context: CanvasRenderingContext2D, start: Vec2, end: Vec2, strokeStyle: CanvasFillStrokeStyles["strokeStyle"] = "grey", lineWidth: number = 0.02) {
    context.strokeStyle = strokeStyle;
    context.lineWidth = lineWidth;
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
}

(() => {
    const game = document.getElementById("game") as (HTMLCanvasElement | null);

    if (game === null) {
        throw new Error("No canvas with id 'game' is found");
    }

    game.width = 800;
    game.height = 800;

    const context = game?.getContext("2d");

    if (context === null) {
        throw new Error("2D context is not supported");
    }

    context.fillStyle = "#303030";

    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    context.scale(context.canvas.width / gridLayout.x, context.canvas.height / gridLayout.y);
    for (let x = 0; x <= gridLayout.x; x++) {
        strokeLine(context, new Vec2(x, 0), new Vec2(x, gridLayout.x));
    }

    for (let y = 0; y <= gridLayout.y; y++) {
        strokeLine(context, new Vec2(0, y), new Vec2(gridLayout.y, y));
    }

    const point1 = new Vec2(0.5 * gridLayout.x, 0.5 * gridLayout.y);
    const point2 = new Vec2(0.3 * gridLayout.x, 0.7 * gridLayout.y);
    fillCircle(context, point1, 0.2, "magenta");
    fillCircle(context, point2, 0.4, "magenta");
    strokeLine(context, point1, point2, "magenta");

    console.log(game);
})()