import * as React from 'react';
import Main from '../Main';
import './FormModalSearch.css'

export default function FormModalSearch({ setShowsModal, open, title, width = 550, top = 130, component, footer }) {

  const handleClose = () => {
    setShowsModal(false);
  };

  return (
    <>
      <Main.Modal
        className='modalF9'
        open={open}
        width={width}
        top={top}
        title={title}
        onOk={handleClose}
        onCancel={handleClose}
        footer={[footer ? footer : null]}
      >
        {component}
      </Main.Modal>
    </>
  );
}

