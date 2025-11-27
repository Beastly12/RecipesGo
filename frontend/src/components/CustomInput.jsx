
export default function CustomInput({value, setValue, emoji}) {
  return (
    <div className="custom-input-div">
      <p>{emoji}</p>
      <input className="custom-input-input" value={value} onChange={e => setValue(e.target.value)} />
    </div>
  )
}
