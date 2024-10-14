export default function Card({ children, title, style }) {
    return (
        <div className={`w-full px-2 my-2 ${style}`}>
            <div className=" bg-white p-2 rounded-xl">
                <h3 className="text-lg py-2 font-bold">{title}</h3>
                { children }
            </div>
        </div>
    );
  }