import { Routes, Route, useParams, useNavigate } from 'react-router-dom'

const PAGES = [
    '/books/dragon-fighter/0-cover.webp',
    '/books/dragon-fighter/1.webp',
    '/books/dragon-fighter/2.webp',
    '/books/dragon-fighter/3.webp',
    '/books/dragon-fighter/4.webp',
    '/books/dragon-fighter/5.webp',
    '/books/dragon-fighter/6.webp',
    '/books/dragon-fighter/7.webp',
    '/books/dragon-fighter/8.webp',
    '/books/dragon-fighter/9.webp',
];

const TEXT = [
    'Dragon Fighter',
    `In a magical kingdom among the clouds, there lived a brave princess named Bowie. Her home was a splendid fairy castle, where she spent her days adventuring on her majestic unicorn, Sparkle.`,
    `One bright morning, a worried villager climbed up to the castle. He had a grave message for Princess Bowie: an evil dragon was causing chaos in the mountains, breathing fire on homes and scaring everyone!`,
    `Princess Bowie was determined to protect her kingdom. She mounted Sparkle, her trusty unicorn, and together they embarked on a journey to the mountains to face the menacing dragon.`,
    `The journey was long and filled with obstacles. They crossed misty rivers and navigated through dense, whispering forests, but Princess Bowie's courage never wavered.`,
    `Finally, they reached the dark cave where the dragon lived. Princess Bowie stood tall, ready to fight, but what she saw surprised her. The dragon wasn't fierce; it was in pain, nursing a hurt claw.`,
    `Seeing the dragon's pain, Princess Bowie's heart filled with compassion. She carefully approached and healed its wounded claw with a magical potion she always carried.`,
    `The dragon, no longer in pain, shared its story with Princess Bowie. It was lonely and scared, which made it act mean. Princess Bowie promised to be its friend.`,
    `Together, Princess Bowie, Sparkle, and the dragon returned to the fairy castle. The kingdom celebrated their new protector, and the dragon promised to guard them all.`,
    `Princess Bowie became a hero, not just for her bravery but for her kindness. The kingdom was safe and happy, with a new friend to help keep it that way.`,
    `And so, Princess Bowie, Sparkle the unicorn, and the dragon lived happily ever after, proving that friendship and understanding can turn foes into friends.`,
];

function Page({ page }) {
    const navigate = useNavigate();
    const imgSrc = PAGES[page];
    if (!imgSrc) {
        return null;
    }
    const text = TEXT[page];
    return (
        <div className="Page">
            <div className="Page-nav">
                {page > 0 &&
                    <button onClick={() => navigate(`/dragon-fighter/${page - 1}`)}>
                        Previous
                    </button>}
                {page == 0 && <button onClick={() => navigate("/")}>Home</button>}
                {page > 0 && <>
                    <div className="spacer" />
                    <button onClick={() => navigate("/dragon-fighter")}>Cover</button>
                </>}
                <div className="spacer" />
                {page < PAGES.length - 1 &&
                    <button onClick={() => navigate(`/dragon-fighter/${page + 1}`)}>
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

function PageRoute() {
    const { page } = useParams();
    return <Page page={parseInt(page, 10)} />
}

export default function DragonFighter() {
    return (
        <Routes>
            <Route path="/" element={<Page page={0} />} />
            <Route path="/:page" element={<PageRoute />} />
        </Routes>
    )
}