interface AccessibilityUIStatic {
  initChecks()
  initExpanse()
  hideModal(arg0: string);
  showModal<E extends HTMLElement>(selector_element: JQuery.Selector | Element | E | JQuery<E>): JQuery<E>;
}
declare const accessibilityUI: AccessibilityUIStatic;
