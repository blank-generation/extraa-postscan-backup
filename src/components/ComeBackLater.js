
export default function ComeBackLater() {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            height: '70vh',
            alignItems: "center",
            flexDirection: "column",
            paddingRight: '2em',
            paddingLeft: '2em'
        }}>
            <h2 style={{textAlign:"center"}}> Looks like you've already done this...</h2>

            <img style={{ maxWidth: '120px' }} src="./assets/calendar.png" alt="" />
            <h3 style={{ textAlign: "center" }}>Thanks for your feedback. Come back after 15 days for more coupons</h3>
            <div className="powered">powered by
                <img src="./assets/extraa_logo.png" alt="" />
            </div>
        </div >
    );
}