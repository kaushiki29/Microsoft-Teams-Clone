import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
        fontWeight: 'bolder',
        paddingBottom: '13px',
        display: "flex",
    },
    pos: {
        marginBottom: 12,
    },
});

export default function SimpleCard() {
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

    return (
        <Card className={classes.root}>
            <CardContent style={{ paddingBottom: 0 }}>
                {/* <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Word of the Day
                </Typography> */}
                <Typography variant="h5" className={classes.title}>
                    <div style={{ marginRight: "auto" }}>Posted by Kaushiki</div>
                    <div>A few hours ago</div>
                </Typography>
                <Divider />
                <Typography variant="body2" component="p" style={{ paddingTop: "15px" }}>
                    What is React?
                    <br />
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" style={{ fontSize: "12px", padding: 0 }}>Reply</Button>
            </CardActions>
        </Card>
    );
}
