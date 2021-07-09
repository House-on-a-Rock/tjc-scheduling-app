import React from 'react';
import PropTypes from 'prop-types';
import CustomDialog from '../shared/CustomDialog';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const PdfRenderer = ({ isOpen, handleClose, dataModel }) => {
  return (
    <CustomDialog open={isOpen} handleClose={handleClose}>
      <Document>
        <Page size="A4">
          <View>
            <Text>hello</Text>
          </View>
          <View>
            <Text>hello2</Text>
          </View>
        </Page>
      </Document>
    </CustomDialog>
  );
};

PdfRenderer.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
  dataModel: PropTypes.object,
};

export default PdfRenderer;
