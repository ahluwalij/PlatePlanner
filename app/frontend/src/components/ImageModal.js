import React, { useState } from 'react';
import { Modal } from 'antd';
import img1 from '../OldDesigns/MMold1.png';
import img2 from '../OldDesigns/MMold2.png';

const ImageModal = (props) => {

    const [visible, setVisible] = useState(false);

    function closeModal() {
        setVisible(false);
    }

    return (
        <>
            <Modal
                className='imageModal'
                visible={visible}
                onCancel={closeModal}
                footer={null}
                centered
                width='85%'
                closable={false}
            >
                <div className='imageModalDiv'>
                    <img src={props.number === 1 ? img1 : img2} alt='Old site design'
                        onClick={closeModal} />
                </div>
            </Modal>
            <img src={props.number === 1 ? img1 : img2} alt='Old site design'
                onClick={() => setVisible(true)} />
        </>
    );
}

export default ImageModal;