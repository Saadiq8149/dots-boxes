import React from "react";
import { nanoid } from "nanoid";

const SIZE_BOARD = 2;

export default function Grid() {

    // Dots --> {id, pos(x, y), selected}
    function createNewDots() {
        let newDots = []
        let x = 0
        let y = 0
        for (let i = 0; i<(SIZE_BOARD+1)*(SIZE_BOARD+1); i++) {
            newDots.push({id: nanoid(), pos:{x:x, y:y}, selected: false})
            if (x == SIZE_BOARD) {
                x = 0;
                y++;
            } else {
                x++;
            }
        }
        return newDots
    }

    const [dots, updateDots] = React.useState(createNewDots)

    function getDotByPosition(dotPos) {
        for (let i = 0; i<dots.length; i++) {
            // console.log(dotPos, dots[i])
            if (dotPos.x === dots[i].pos.x && dotPos.y === dots[i].pos.y) {
                return dots[i]
            }
        }
    }

    function getDots(x, y) {
        let dotsInBox = []
        let dotsPos = [{x:x, y:y}, {x:x+1, y:y}, {x:x, y:y+1}, {x:x+1, y:y+1}]
        for (let i = 0; i<dotsPos.length; i++) {
            dotsInBox.push(getDotByPosition(dotsPos[i]))
        }
        return dotsInBox
    }

    // Boxes --> {id, pos(x, y), lines, dots}
    function createNewBoxes() {
        let newBoxes = []
        let x = 0
        let y = 0
        for (let i = 0; i<(SIZE_BOARD)*(SIZE_BOARD); i++) {
            newBoxes.push({id: nanoid(), pos:{x:x, y:y}, lines: [false, false, false, false], dots: getDots(x, y), filled: false})
            if (x == SIZE_BOARD-1) {
                x = 0;
                y++;
            } else {
                x++;
            }
        }
        return newBoxes
    }

    const [boxes, updateBoxes] = React.useState(createNewBoxes())
    const [selected, updateSelected] = React.useState([])

    function drawLine(selectedDots, box) {
        // indices represent the position of the dots
        let positions = []
        for (let i = 0; i<box.dots.length; i++) {
            if (selectedDots[0].id == box.dots[i].id || selectedDots[1].id == box.dots[i].id) {
                positions.push(i)
            }
        }
        if (positions.includes(0) && positions.includes(1)) {
            return 0
        } else if (positions.includes(1) && positions.includes(3)) {
            return 1
        } else if (positions.includes(2) && positions.includes(3)) {
            return 2
        } else if (positions.includes(0) && positions.includes(2)) {
            return 3
        }
        return -1
    }

    function move() {
        updateBoxes(prevBoxes => {
            return prevBoxes.map((box) => {
                let lines = box.lines
                const selectedDots = box.dots.filter((dot) => selected.includes(dot.id))
                if (selectedDots.length == 2) {
                    const line = drawLine(selectedDots, box)
                    if (line != -1) {
                        lines[line] = true;
                    }
                }
                const filled = lines.filter((line) => line==true)
                const colored = filled.length == 4 ? true : false
                return {...box, lines: lines, filled: colored}
            })
        })
    }

    // Syncing the selected dots list with dots array state
    React.useEffect(() => {
        updateSelected(() => {
            let newlySelected = []
            const selectedDots = dots.filter((dot) => dot.selected)
            selectedDots.forEach(dot => newlySelected.push(dot.id))
            return newlySelected
        })
        updateBoxes(prevBoxes => {
            return prevBoxes.map(box => {
                return {
                    ...box,
                    dots: getDots(box.pos.x, box.pos.y)
                }
            })
        })
    }, [dots])

    React.useEffect(() => {
        if (selected.length == 2) {
            move()
        }
    }, [selected])

    React.useEffect(() => {
        if (selected.length == 2) {
            for (let i = 0; i<dots.length; i++) {
                updateDots(prevDots => {
                    return prevDots.map(dot => {
                        if (selected.includes(dot.id)) {
                            return {...dot, selected: false}
                        } else {
                            return dot
                        }
                    })
                })
            }
        }
    }, [boxes])

    function select(event, id) {
        updateDots(prevDots => {
            return (
                prevDots.map(dot => {
                    return dot.id == id ? {...dot, selected: !dot.selected} : {...dot}
                })
            )
        })
    }

    function setStyles(id) {
        const LINE = '2px solid black'
        const NOLINE = '0px'
        for (let i = 0; i<boxes.length; i++) {
            if (boxes[i].id == id) {
                const lines = boxes[i].lines
                const styles = {
                    borderTop: (lines[0]) ? LINE : NOLINE,
                    borderBottom: (lines[2]) ? LINE : NOLINE,
                    borderLeft: (lines[3]) ? LINE : NOLINE,
                    borderRight: (lines[1]) ? LINE : NOLINE,
                }
                return styles
            }
        }
    }

    const dotElements = dots.map((dot) => {
        return <span id={dot.id} onClick={(event) => select(event, dot.id)} className={`dot ${dot.selected && "selected"}`}></span>
    })
    const boxElements = boxes.map((box) => {
        const styles = setStyles(box.id)
        return <div id={box.id} style={styles} className={`box ${box.filled && "colored"}`}></div>
    })
    const gameElements = {dots: dotElements, boxes: boxElements}


    return (
        <div>
            <div className="grid-dots">
                {gameElements.dots}
            </div>
            <div className="grid-boxes">
                {gameElements.boxes}
            </div>
        </div>
    )
}
