interface props {
  className?: string;
  children: React.ReactNode;
}

function Cards(props: props) {
  return (
    <article
      className={`bg-white shadow-md min-h-[10rem] h-auto rounded-lg p-4 ${props.className}`}
    >
      {props.children}
    </article>
  );
}

export default Cards;
