class Vec2 {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    distanceFrom(that: Vec2): number {
        return that.sub(this).length();
    }
    normalize(): Vec2 {
        const l = this.length();
        if (l != 0)
            return new Vec2(this.x / l, this.x / l);
        return new Vec2(0, 0);
    }
    add(that: Vec2): Vec2 { return new Vec2(this.x + that.x, this.y + that.y); }
    sub(that: Vec2): Vec2 { return new Vec2(this.x - that.x, this.y - that.y); }
    dot(that: Vec2): Vec2 { return new Vec2(this.x * that.x, this.y * that.y); }
    div(that: Vec2): Vec2 { return new Vec2(this.x / that.x, this.y / that.y); }
}

const gridLayout = new Vec2(16, 16);

function fillCircle(context: CanvasRenderingContext2D, center: Vec2, radius: number, fillStyle: CanvasFillStrokeStyles["fillStyle"] = "grey") {
    context.fillStyle = fillStyle;
    context.beginPath();
    context.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    context.fill();
}

function strokeLine(context: CanvasRenderingContext2D, begin: Vec2, end: Vec2, strokeStyle: CanvasFillStrokeStyles["strokeStyle"] = "grey", lineWidth: number = 0.02) {
    context.strokeStyle = strokeStyle;
    context.lineWidth = lineWidth;
    context.beginPath();
    context.moveTo(begin.x, begin.y);
    context.lineTo(end.x, end.y);
    context.stroke();
}

function drawGrids(context: CanvasRenderingContext2D, layout: Vec2) {
    context.fillStyle = "#303030";

    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    context.scale(context.canvas.width / gridLayout.x, context.canvas.height / gridLayout.y);

    for (let x = 0; x <= gridLayout.x; x++) {
        strokeLine(context, new Vec2(x, 0), new Vec2(x, gridLayout.x));
    }

    for (let y = 0; y <= gridLayout.y; y++) {
        strokeLine(context, new Vec2(0, y), new Vec2(gridLayout.y, y));
    }
}

function snapRayToGrid(x: number, dx: number, esp: number = 1e-3): number {
    if (dx > 0)
        return Math.ceil(x + Math.sign(dx) * esp);
    else if (dx < 0)
        return Math.floor(x + Math.sign(dx) * esp);
    return x;
}

function rayCollisionWithGrid(begin: Vec2, end: Vec2): Vec2 {
    const d = end.sub(begin);
    if (d.x !== 0) {
        const m = d.y / d.x;
        const c = begin.y - m * begin.x;

        let p3 = new Vec2(snapRayToGrid(end.x, d.x), snapRayToGrid(end.x, d.x) * m + c);

        if (m !== 0) {
            const p4 = new Vec2((snapRayToGrid(end.y, d.y) - c) / m, snapRayToGrid(end.y, d.y));
            if (p4.distanceFrom(end) < p3.distanceFrom(end))
                p3 = p4;
        }
        return p3;
    }
    else
        return new Vec2(end.x, snapRayToGrid(end.y, d.y))
}

function hitCell(p1: Vec2, p2: Vec2, esp: number = 1e-3) {
    const d = p2.sub(p1);
    return new Vec2(Math.floor(p2.x + Math.sign(d.x) * esp), Math.floor(p2.y + Math.sign(d.y) * esp));
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


    let mousePosition: Vec2 | undefined = undefined;
    const canvasLayout: Vec2 = new Vec2(context.canvas.width, context.canvas.height);

    game.addEventListener("mousemove", (event) => {
        mousePosition = new Vec2(event.offsetX, event.offsetY).dot(gridLayout).div(canvasLayout);

        context.reset();
        drawGrids(context, gridLayout);

        let point = new Vec2(0.5 * gridLayout.x, 0.5 * gridLayout.y);
        fillCircle(context, point, 0.1, "magenta");

        for (; ;) {
            fillCircle(context, mousePosition, 0.1, "red");
            strokeLine(context, point, mousePosition, "red");

            const c = hitCell(point, mousePosition);
            if (c.x < 0 || c.x > gridLayout.x || c.y < 0 || c.y > gridLayout.y)
                break;

            const p3 = rayCollisionWithGrid(point, mousePosition);
            point = mousePosition;
            mousePosition = p3;
        }
    })

    drawGrids(context, gridLayout);

    console.log(game);
})()