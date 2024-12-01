const loadingCat = require('../images/cat-what.gif');

export const ErrorPage = () => {

    return(
        <div style={{display: 'grid', rowGap : '2rem',justifyContent:'center'}}>
            <h2>Where are you going ?</h2>
            <img alt='Loading cat gif' src={loadingCat}/>
        </div>
    )
}