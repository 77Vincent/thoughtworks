class Veact {
  constructor(rootDOM, vDOM, model) {
    this.rootDOM = rootDOM
    this.vDOM = vDOM 
    this.model = model 
  }

  static createApp(rootDOM, model) {
    return new Veact(rootDOM, {}, model)
  }

  static createElement(type = 'div', props = {}, ...children) {
    const childrenVDOM = children.map(child => {
      if (typeof child === 'function') {
        return child()
      }
      return child
    })
    return { type, props, children: childrenVDOM }
  }

  mount(App) {
    const vDOM = App(this)
    this.vDOM = vDOM 
    this.App = App
    this.rootDOM.appendChild(this.render(vDOM))
  }

  setState(callback) {
    const newModel = callback(this.model)
    Object.assign(this.model, newModel)
    this.rootDOM.removeChild(this.rootDOM.children[0])
    this.rootDOM.appendChild(this.render(this.App(this)))
  }

  render(vDOM) {
    if (typeof vDOM === 'string') {
      return document.createTextNode(vDOM)
    }

    const { className, onClick, style } = vDOM.props
    const $el = document.createElement(vDOM.type)

    if (className) { $el.className = className }
    if (onClick) { $el.onclick = onClick }

    vDOM.children
      .map(v => this.render(v))
      .forEach($el.appendChild.bind($el))
    
    return $el
  }
}

export default Veact