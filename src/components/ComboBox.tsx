import '../stylings/content/combobox.css';

export default function ComboBox() {  
  return (
    <>
    <div className="select-box">
      <div className="select-box__current" tabIndex={1}>
        <div className="select-box__value">
          <input className="select-box__input" type="radio" id="0" value="1" name="Ben" checked />
          <p className="select-box__input-text">Cream</p>
        </div>
        <div className="select-box__value">
          <input className="select-box__input" type="radio" id="1" value="2" name="Ben" checked/>
          <p className="select-box__input-text">Cheese</p>
        </div>
        <div className="select-box__value">
          <input className="select-box__input" type="radio" id="2" value="3" name="Ben" checked/>
          <p className="select-box__input-text">Milk</p>
        </div>
        <div className="select-box__value">
          <input className="select-box__input" type="radio" id="3" value="4" name="Ben" checked/>
          <p className="select-box__input-text">Honey</p>
        </div>
        <div className="select-box__value">
          <input className="select-box__input" type="radio" id="4" value="5" name="Ben" checked/>
          <p className="select-box__input-text">Toast</p>
        </div><img className="select-box__icon" src="http://cdn.onlinewebfonts.com/svg/img_295694.svg" alt="Arrow Icon" aria-hidden="true"/>
      </div>
      <ul className="select-box__list">
        <li>
          <label className="select-box__option" htmlFor="0" aria-hidden>Cream</label>
        </li>
        <li>
          <label className="select-box__option" htmlFor="1" aria-hidden>Cheese</label>
        </li>
        <li>
          <label className="select-box__option" htmlFor="2" aria-hidden>Milk</label>
        </li>
        <li>
          <label className="select-box__option" htmlFor="3" aria-hidden>Honey</label>
        </li>
        <li>
          <label className="select-box__option" htmlFor="4" aria-hidden>Toast</label>
        </li>
      </ul>
    </div>
    </>
  );
}
