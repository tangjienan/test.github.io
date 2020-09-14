class Maze {
    constructor(width, height) {
        if (width < 2 || height < 2) {
            // default to a 5 X 5 Maze
            width = height = 5
        }

        let cellWithFourWallValue = 15
        this.maze = new Array(width)
            .fill(cellWithFourWallValue)
            .map((x) => new Array(height).fill(cellWithFourWallValue))
    }

    static printCell(cellValue) {
        // x, y always valid

        // up down left right

        let top = false
        let left = false
        let right = false
        let down = false
        // 1 0 0 0
        if ((cellValue & 8) != 0) {
            top = true
        }
        // 0 1 1 1
        // 0 1 0 0
        if ((cellValue & 4) != 0) {
            down = true
        }

        // 0 0 1 0
        if ((cellValue & 2) != 0) {
            left = true
        }

        // 0 0 0 1
        if ((cellValue & 1) != 0) {
            right = true
        }

        let width = 10
        let height = 5
        let bar = '----------'

        let printStr = ''

        if (top) printStr += bar + '\n'

        for (let i = 0; i < height; i++) {
            let row = ''
            for (let j = 0; j < width; j++) {
                if (j == 0) row += left ? '|' : ' '

                if (j == width - 1) row += right ? '|' : ''

                if (j > 0 && j < width - 1) row += ' '
            }

            printStr += row + '\n'
        }

        if (down) printStr += bar

        return printStr
    }

    // {x, y, value}, c1 connect to c2
    static connect(c1, c2) {
        // up down left rigt

        // connect to right
        if (c1.x + 1 == c2.x) {
            // c1 break right wall, 14 -> 1110
            c1.value &= 14
            // c2 break left wall, 13 -> 1101
            c2.value &= 13
        }
        // connect to left
        else if (c1.x - 1 == c2.x) {
            // c1 break left wall,  13 -> 1101
            c1.value &= 13
            // c2 break right wall, 14 -> 1110
            c2.value &= 14
        }
        // connect to down
        else if (c1.y + 1 == c2.y) {
            // c1 break down wall, 11 -> 1011
            c1.value &= 11
            // c2 break up wall, 7 -> 0111
            c2.value &= 7
        }
        // connect to top
        else {
            // c1 break up wall, 7 -> 0111
            c1.value &= 7
            // c2 break down wall, 11 -> 1011
            c2.value &= 11
        }
    }

    test() {
        // some test
    }
}

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        // And swap it with the current element.
        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
    }

    return array
}

class RecursiveBacktracking {
    constructor(maze) {
        this.maze = maze
        this.visited = new Set()
    }

    outOfBound(start_x, start_y) {
        if (
            start_x < 0 ||
            start_x > this.maze.length - 1 ||
            start_y < 0 ||
            start_y > this.maze[0].length - 1
        ) {
            return true
        }

        return false
    }

    create(start_x, start_y) {
        if (this.outOfBound(start_x, start_y)) return

        this.visited.add(start_x + '%' + start_y)

        shuffle([
            [0, -1],
            [0, 1],
            [1, 0],
            [-1, 0],
        ]).forEach((dir) => {
            let newX = start_x + dir[0]
            let newY = start_y + dir[1]

            if (
                !this.outOfBound(newX, newY) &&
                !this.visited.has(newX + '%' + newY)
            ) {
                let c1 = {
                    x: start_x,
                    y: start_y,
                    value: this.maze[start_y][start_x],
                }

                let c2 = {
                    x: newX,
                    y: newY,
                    value: this.maze[newY][newX],
                }

                Maze.connect(c1, c2)

                this.maze[start_y][start_x] = c1.value
                this.maze[newY][newX] = c2.value

                this.create(newX, newY)
            }
        })
    }
}

function createBlockDiv(o) {
    let tmp = document.createElement('div')
    tmp.className = 'block'
    if (o.top) {
        tmp.classList.add('topBorder')
    }

    if (o.down) {
        tmp.classList.add('downBorder')
    }

    if (o.left) {
        tmp.classList.add('leftBorder')
    }

    if (o.right) {
        tmp.classList.add('rightBorder')
    }

    return tmp
}

function renderMaze(maze) {
    let width = maze.length
    let parentDiv = document.getElementsByClassName('main')[0]
    let maxWidth = 20

    width = width > maxWidth ? maxWidth : width

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < width; j++) {
            let tmp = createBlockDiv(convertMazeValueToBorderValue(maze[i][j]))
            parentDiv.appendChild(tmp)

            if (i == width - 1 && j == width - 1) {
                Array.from(document.getElementsByClassName('block')).forEach(
                    (x) => {
                        x.setAttribute('style', `height:${x.offsetWidth}px`)
                    }
                )
            }
        }
    }
}

function convertMazeValueToBorderValue(val) {
    let res = {
        top: (val & 8) != 0,
        down: (val & 4) != 0,
        left: (val & 2) != 0,
        right: (val & 1) != 0,
    }

    return res
}

function playGames(width) {
    var maze = new Maze(width, width).maze

    new RecursiveBacktracking(maze).create(0, 0)

    return maze
}

document.addEventListener('DOMContentLoaded', async function (event) {
    // create maze div

    let width = 20

    let maze = playGames(width)

    renderMaze(maze)
})
