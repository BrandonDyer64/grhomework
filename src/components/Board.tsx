import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import Card from "./Card";
import { shuffleArray, range } from "../Utils";

interface Props {
    numCards: number;
    onMatch: () => void;
    onFail: () => void;
    onWin: () => void;
}

export default (props: Props) => {
    const styles = useStyles({});

    const [disabledCards, setDisabledCards] = useState<number[]>([]);
    const [openCardA, setOpenCardA] = useState(-1);
    const [openCardB, setOpenCardB] = useState(-1);
    const [cards] = useState<number[]>(() =>
        shuffleArray([
            ...range(0, props.numCards / 2),
            ...range(0, props.numCards / 2),
        ])
    );

    if (disabledCards.length >= cards.length) {
        props.onWin();
    }

    const onCardOpen = (card: number) => {
        if (card === openCardA) return;

        if (openCardA < 0) {
            setOpenCardA(card);
        } else if (openCardB < 0) {
            setOpenCardB(card);
            if (cards[card] === cards[openCardA]) {
                setDisabledCards(c => [...c, card, openCardA]);
                props.onMatch();
            } else {
                props.onFail();
            }
        } else {
            setOpenCardA(card);
            setOpenCardB(-1);
        }
    };

    return (
        <div className={styles.root}>
            {cards.map((card, i) => (
                <Card
                    value={card}
                    isOpen={i === openCardA || i === openCardB}
                    isEnabled={!disabledCards.includes(i)}
                    onClick={() => onCardOpen(i)}
                    key={i}
                />
            ))}
        </div>
    );
};

export const useStyles = makeStyles({
    root: {
        display: "flex",
        padding: 20,
        paddingTop: 50,
        flexWrap: "wrap",
        maxWidth: 1000,
        margin: "auto",
        justifyContent: "space-evenly",
        "& > *": {
            margin: "calc(10px + 1vh)",
        },
    },
});
