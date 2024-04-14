import { Component } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom'

function Page({ bookKey, page, images, texts }) {
    const navigate = useNavigate();
    const imgSrc = images[page];
    if (!imgSrc) {
        return null;
    }
    const text = texts[page];
    return (
        <div className="Page">
            <div className="Page-nav">
                {page > 0 &&
                    <button onClick={() => navigate(`/${bookKey}/${page - 1}`)}>
                        Previous
                    </button>}
                {page == 0 && <button onClick={() => navigate("/")}>Home</button>}
                {page > 0 && <>
                    <div className="spacer" />
                    <button onClick={() => navigate(`/${bookKey}`)}>Cover</button>
                </>}
                <div className="spacer" />
                {page < images.length - 1 &&
                    <button onClick={() => navigate(`/${bookKey}/${page + 1}`)}>
                        Next
                    </button>}
            </div>
            <div>
                <img src={imgSrc} />
            </div>
            {text && <div className="Page-text">{text}</div>}
        </div>
    );
}

function PageRoute({ bookKey, images, texts }) {
    const { page } = useParams();
    return <Page bookKey={bookKey} images={images} texts={texts} page={parseInt(page, 10)} />;
}

export default class Book extends Component {
    get bookKey() {
        throw new Error("Not implemented");
    }

    get images() {
        throw new Error("Not implemented");
    }

    get texts() {
        throw new Error("Not implemented");
    }

    render() {
        return (
            <Routes>
                <Route path="/" element={<Page bookKey={this.bookKey} images={this.images} texts={this.texts} page={0} />} />
                <Route path="/:page" element={<PageRoute bookKey={this.bookKey} images={this.images} texts={this.texts} />} />
            </Routes>
        );
    }
}