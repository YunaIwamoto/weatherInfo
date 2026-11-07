interface PrefectureSelectProps {
  onChangeX: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}


export function PrefectureSelect(props: PrefectureSelectProps){
    return (
        <div className='flex flex-row justify-end'>
        <label className="flex" htmlFor="pref-select">都道府県</label>

        <select  onChange={props.onChangeX} className="flex" name='pref' id="pref-select">
          <option value="016010">北海道</option>
          <option value="020010">青森県</option>
          <option value="030010">岩手県</option>
          <option value="040010">宮城県</option>
          <option value="050010">秋田県</option>
          <option value="060010">山形県</option>
          <option value="070010">福島県</option>
          <option value="080010">茨城県</option>
          <option value="090010">栃木県</option>
          <option value="100010">群馬県</option>
          <option value="110010">埼玉県</option>
          <option value="120010">千葉県</option>
          <option value="130010" selected>東京都</option>
          <option value="140010">神奈川県</option>
          <option value="150010">新潟県</option>
          <option value="160010">富山県</option>
          <option value="170010">石川県</option>
          <option value="180010">福井県</option>
          <option value="190010">山梨県</option>
          <option value="200010">長野県</option>
          <option value="260010" >京都府</option>
        </select>
      </div>

    );
}